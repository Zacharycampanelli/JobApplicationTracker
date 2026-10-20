# Release checklist and known limitations

Use this checklist before substantial deployments. Reset the boxes for each release and record the date and commit tested. Use disposable accounts and dummy files for manual checks.

## Automated checks

Run from the project root:

```sh
npm run check
npm --prefix Backend run build
npm --prefix Backend run test:db
```

- [ ] Frontend and backend lint pass.
- [ ] Frontend and backend builds pass.
- [ ] Frontend and backend fast tests pass.
- [ ] Database tests pass against the dedicated `job_tracker_test` database.
- [ ] Investigate failures, fix release-blocking defects, and rerun affected checks.

See the README for test-database setup. Never use production or development databases for the database suite.

## Deployment and manual verification

- [ ] Review environment settings and migration requirements; back up the database and uploaded files before changes that affect stored data. See [backup and restore](backup-and-restore.md).
- [ ] Confirm frontend and backend deployments succeed.
- [ ] Register, log out, log back in, and refresh while signed in.
- [ ] Create, edit, and delete an application; confirm saved changes persist.
- [ ] Upload a dummy resume, select it for an application, and delete it.
- [ ] Download an owned resume; confirm the original filename and readable contents.
- [ ] Open its download URL while logged out: expect `401`.
- [ ] Open that URL from another account: expect `404`.
- [ ] Confirm downloading does not change resume selection.
- [ ] Save profile and preference changes; refresh to confirm persistence.
- [ ] Request a password reset, receive the real email, and set a new password; confirm login with the new password works.
- [ ] Delete disposable accounts and test data.

## Phase 5 verification record — October 20, 2026

- Frontend/backend lint and builds passed; frontend tests: 54 passed; backend fast tests: 75 passed; database tests: 2 passed.
- Focused tests cover resume authentication, ownership-filtered listing/deletion/download, download filename, missing-file response, and password-reset email failure followed by a successful retry.
- Existing rate-limit and CORS tests passed; authentication-route limiter wiring was reviewed.
- The owner reported all core deployed workflows passing, including real password-reset email delivery and disposable-account deletion.
- The owner reported local downloads working, including original filename/readable contents, with logged-out access returning `401` and another account receiving `404`.
- Earlier backend fast-test runs had two unexpected failures that disappeared without code changes. Their cause remains unknown; they did not recur in the final full check.
- No known release-blocking defect was found in these checks. This record is scoped to the verification above, not a guarantee of exhaustive coverage.

Live download verification — October 20, 2026 (owner-reported):

- [x] Download feature is available on the live site; owned files download with the original filename and readable contents.
- [x] Logged-out download requests return `401`.
- [x] Another account's download requests return `404`.

Local source revision at the time of this report: `8f5baed8`. The deployed commit IDs were not independently inspected. The scoped Phase 5 verification is complete based on the automated results and owner-reported walkthroughs above. The unchecked sections at the top are reusable templates for future releases.

## Known limitations and deferred work

The Phase 3 and Phase 4 items below come from the owner's completed phase checklists. They remain optional unless their stated trigger applies; they are not requirements for finishing the current release.

### Phase 3 — File and data reliability

- [ ] Automate backups further if the basic procedure becomes difficult to maintain.
- [ ] Add more file-cleanup infrastructure only if a demonstrated problem requires it.
- [ ] Consider object storage if the app grows or needs multiple backend instances.

### Phase 4 — Deployment and maintenance

- [ ] Add structured production logging when troubleshooting needs justify it.
- [ ] Add external error monitoring when ongoing usage justifies it.
- [ ] Configure a custom domain if wanted.
- [ ] Complete email domain authentication when configuring an owned sending domain.

### Phase 5 — Testing and download follow-ups

- Browser workflows are checked manually; a small Playwright suite is deferred.
- API coverage is focused on identified risks rather than every endpoint and error combination. Add tests when behavior changes or bugs appear.
- The frontend build reports a bundle-size warning. Optimization is deferred; the build succeeds.
- Resume downloads require a valid session and ownership. Public sharing links and inline previews are outside the current scope.
- Direct download links can show an API error response if the session expires or the file is missing; there is no download-error toast.
- Uploads live on the backend filesystem/volume. Database backups alone do not preserve the files; follow the separate backup procedure.
- The authentication rate limiter uses in-memory state shared across the protected authentication endpoints per IP. State resets on restart and is not shared between backend instances; distributed rate limiting is deferred for the current single-instance setup.
- Email-provider behavior is mocked in automated tests. Real delivery depends on provider availability/configuration and is checked manually before release.
