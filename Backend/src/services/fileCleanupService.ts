import { unlink } from "node:fs/promises";

import { prisma } from "../lib/prisma";

export const processFileDeletionTask = async (task: {
    id: number;
    filePath: string;
}) => {
    try {
        await unlink(task.filePath);
    } catch (error) {
        const alreadyMissing = error instanceof Error &&
            "code" in error && error.code === "ENOENT";

        if (!alreadyMissing) {
            throw error;
        }
    }
    await prisma.fileDeletionTask.delete({
        where: { id: task.id }
    })
};

export const retryPendingFileDeletions = async () => {
    const tasks = await prisma.fileDeletionTask.findMany({
        orderBy: { id: "asc" },
        take: 100
    });
    for (const task of tasks) {
        try {

            await processFileDeletionTask(task)

        } catch (error) {
            console.error("Failed to retry file deletions", error);
        }
    }
}