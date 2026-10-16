# Job Tracker backup and restore

## What needs backing up

- PostgreSQL contains accounts, applications, profile information, and upload paths.
- The backend upload volume contains the actual resume and avatar files. A database dump does not contain these files.

This project currently uses manual database exports. No Railway backup schedule was enabled during this exercise. Repeat the export before database changes and at least weekly while the hosted app is actively used. Changes since the last export cannot be recovered from that export. Keep copies on a separate trusted backup destination as well as this computer. Never commit dumps, upload archives, or database credentials to Git.

## Create a database backup on macOS

Prerequisites: Homebrew PostgreSQL 18 tools, authenticated Railway CLI, and the local folder linked to Job Tracker / production / Postgres. Check the selection with `railway status` before connecting.

In one terminal:

```sh
railway connect Postgres --tunnel-only
```

Leave this terminal open. Note the displayed port, username, and database. Keep the password and connection URL private. The port can change each time.

In another terminal:

```sh
mkdir -p "$HOME/JobTrackerBackups"
chmod 700 "$HOME/JobTrackerBackups"
umask 077
read "BACKUP_TUNNEL_PORT?Enter the tunnel port: "
BACKUP_FILE="$HOME/JobTrackerBackups/job-tracker-$(date +%Y-%m-%d-%H%M%S).dump"

"$(brew --prefix postgresql@18)/bin/pg_dump" \
  --host=127.0.0.1 \
  --port="$BACKUP_TUNNEL_PORT" \
  --username=postgres \
  --dbname=railway \
  --format=custom \
  --file="$BACKUP_FILE" \
  --password
```

Enter the password at the prompt. Check for errors, then inspect the archive:

```sh
"$(brew --prefix postgresql@18)/bin/pg_restore" --list "$BACKUP_FILE"
```

A readable table listing is an initial check; it does not prove that restoration works. Use an exact filename when selecting an older backup, rather than a wildcard that could select multiple files.

## Practice restoring locally

Use PostgreSQL 18 on port 5433, separate from the PostgreSQL 16 development server. These commands assume Homebrew has already initialized its PostgreSQL 18 data directory. Do not reuse a populated practice database or restore over production.

```sh
"$(brew --prefix postgresql@18)/bin/pg_ctl" \
  -D "$(brew --prefix)/var/postgresql@18" \
  -l "$HOME/JobTrackerBackups/restore-server.log" \
  -o "-p 5433 -h 127.0.0.1" start

"$(brew --prefix postgresql@18)/bin/createdb" \
  --host=127.0.0.1 --port=5433 job_tracker_restore_check
```

If the server is already running or the database already exists, inspect it before proceeding. Select the exact dump file to restore, then run:

```sh
read "RESTORE_DUMP_FILE?Enter the absolute path to the dump file: "

"$(brew --prefix postgresql@18)/bin/pg_restore" \
  --host=127.0.0.1 \
  --port=5433 \
  --dbname=job_tracker_restore_check \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  --verbose \
  "$RESTORE_DUMP_FILE"
```

The owner and privilege options omit Railway-specific permissions for this local drill. Verify the result:

```sh
"$(brew --prefix postgresql@18)/bin/psql" \
  --host=127.0.0.1 --port=5433 \
  --dbname=job_tracker_restore_check <<'SQL'
SELECT 'User' AS table_name, COUNT(*) FROM public."User"
UNION ALL
SELECT 'JobApplication', COUNT(*) FROM public."JobApplication"
UNION ALL
SELECT 'Resume', COUNT(*) FROM public."Resume";
SQL
```

Compare these counts with the source database through the tunnel, substituting its port and using `--username=postgres --dbname=railway --password`. Counts can differ if source records changed after the export. Inspect representative restored records privately when a more detailed check is needed.

After the drill, stop only the temporary PostgreSQL 18 server:

```sh
"$(brew --prefix postgresql@18)/bin/pg_ctl" \
  -D "$(brew --prefix)/var/postgresql@18" stop
```

Close the Railway tunnel with Ctrl+C. The practice database remains on disk for inspection. This guide does not authorize replacing a live database.

## Verified exercise: October 15, 2026

- Exported Railway PostgreSQL 18.6 using pg_dump 18.6.
- Restored into a separate local PostgreSQL 18 database with table creation, data loading, indexes, and constraints reported in verbose output.
- Restored and source counts matched: User 3, JobApplication 1, Resume 1.
- Regenerated the exposed database password using Postgres > Database > Config, then verified hosted login and applications worked after the backend picked up the credentials.
- Backend DATABASE_URL references `${{Postgres.DATABASE_URL}}`.

The original restore attempt left an empty practice database; its cause was not established. The subsequent explicit-filename verbose restore and count comparison verified recovery. Do not treat an absence of terminal errors alone as proof.

## Back up uploaded files

Verified backend paths: working directory `/app`, volume mount `/app/uploads`, with `avatars` and `resumes` subdirectories. The Railway volume is `job-tracker-backend-volume` in production.

From the linked Job Tracker project:

```sh
umask 077
UPLOAD_BACKUP_DIR="$HOME/JobTrackerBackups/uploads-$(date +%Y-%m-%d-%H%M%S)"
railway volume files --volume job-tracker-backend-volume download / "$UPLOAD_BACKUP_DIR"
find "$UPLOAD_BACKUP_DIR" -type f
```

If prompted, select the production backend volume, not the Postgres volume. `/` is the selected volume's root. The verified download preserved the `avatars` and `resumes` folders. Open sample files privately to check readability. Downloads can incur Railway service network usage; avoiding scheduled backup storage does not guarantee zero usage charges.

Take the database export and file copy together while no one is uploading, replacing files, or deleting accounts. These are separate operations, not an atomic snapshot. The October 15 exercises were taken at different times; a combined application recovery was not tested.

## Practice recovering files separately

In the same shell where UPLOAD_BACKUP_DIR was set:

```sh
UPLOAD_RESTORE_DIR="$HOME/JobTrackerBackups/restore-check-$(date +%Y-%m-%d-%H%M%S)"
mkdir -p "$UPLOAD_RESTORE_DIR"
cp -R "$UPLOAD_BACKUP_DIR/." "$UPLOAD_RESTORE_DIR/"
diff -r "$UPLOAD_BACKUP_DIR" "$UPLOAD_RESTORE_DIR"
```

No output from a successful diff means the copied directory contents match. On October 15, the downloaded resume PDF and avatar image opened correctly, and the recovery-folder comparison produced no differences.

For an actual recovery, preserve the folder structure under `/app/uploads` and pair the files with the corresponding database backup. Resume records contain filesystem paths and avatar records contain URLs; restoring a record alone does not restore its file. Before any live upload, inspect the CLI's upload help, preserve current data, and review the exact destination and any overwrite behavior. A live volume overwrite has not been exercised or authorized by this local drill.

## Verification limits

- Database restore and file recovery were verified separately, locally.
- A combined application recovery and live production replacement have not been exercised.
- Backups currently live on this computer. A separate trusted copy is still needed to protect against loss of the computer.

## Optional: run both backups with one script

This script automates the commands, not the schedule. Run it manually from the linked Job Tracker project. It does not install a background job or store your password. Keep the app quiet during the backup so database records and uploaded files stay aligned.

First, in a separate terminal, open the Postgres tunnel and leave it running:

```sh
railway connect Postgres --tunnel-only
```

Save the following as `backup-job-tracker.zsh` in the project root. Read the short script before running it. It uses the production backend volume and the Postgres tunnel you opened above.

```zsh
#!/bin/zsh
set -euo pipefail
umask 077

# Check required tools before creating any files.
PG_TOOLS="$(brew --prefix postgresql@18)/bin"
command -v railway >/dev/null
[[ -x "$PG_TOOLS/pg_dump" && -x "$PG_TOOLS/pg_restore" ]]

# Check that this folder is linked to the intended Railway project.
railway status
read "BACKUP_CONFIRM?Is this Job Tracker / production? Type yes: "
[[ "$BACKUP_CONFIRM" == yes ]] || exit 1
read "BACKUP_PORT?Enter the port from the open Postgres tunnel: "
[[ "$BACKUP_PORT" == <1-65535> ]] || {
  print -u2 "Enter a valid port between 1 and 65535."
  exit 1
}

# Each run gets its own private folder; mktemp prevents name collisions.
BACKUP_ROOT="$HOME/JobTrackerBackups"
mkdir -p "$BACKUP_ROOT"
chmod 700 "$BACKUP_ROOT"
BACKUP_RUN="$(mktemp -d "$BACKUP_ROOT/run-$(date +%Y-%m-%d-%H%M%S)-XXXXXX")"
trap 'print -u2 "Backup incomplete. Inspect the partial files in: $BACKUP_RUN"' ZERR

# pg_dump prompts privately for the database password.
"$PG_TOOLS/pg_dump" \
  --host=127.0.0.1 \
  --port="$BACKUP_PORT" \
  --username=postgres \
  --dbname=railway \
  --format=custom \
  --file="$BACKUP_RUN/database.dump" \
  --password

"$PG_TOOLS/pg_restore" --list "$BACKUP_RUN/database.dump" \
  > "$BACKUP_RUN/database-contents.txt"

# If prompted, select job-tracker-backend-volume in production.
railway volume files --volume job-tracker-backend-volume \
  download / "$BACKUP_RUN/uploads"

# Require the expected folders before marking this run complete.
[[ -d "$BACKUP_RUN/uploads/avatars" && -d "$BACKUP_RUN/uploads/resumes" ]]
print "Backup commands completed at $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  > "$BACKUP_RUN/COMPLETE.txt"
print "Backup saved to: $BACKUP_RUN"
print "Copy this folder to a separate trusted backup destination."
```

Run it with:

```sh
zsh ./backup-job-tracker.zsh
```

After it finishes, close the tunnel with Ctrl+C. The script stops if a command fails and preserves partial files for inspection. A run without `COMPLETE.txt` is incomplete. The marker confirms the commands and basic archive/folder checks passed; it does not replace a practice restore or prove the database and files were captured at exactly the same instant. Periodically repeat the restore checks documented above.

The script does not delete old backups, upload them elsewhere, rotate credentials, or restore anything. Backups contain private account and resume information, so store the folders privately and outside Git. Railway downloads may incur network usage charges. This script has not been run against production as part of adding this documentation.
