import "dotenv/config";

import { prisma } from "../lib/prisma";
import { retryPendingFileDeletions } from "../services/fileCleanupService";

try {
    await retryPendingFileDeletions();
} catch (error) {
    console.error("Unable to run file cleanup:", error);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
