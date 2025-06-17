/*
  Warnings:

  - You are about to drop the column `countdownEnd` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `countdownStart` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `countdownEnd`,
    DROP COLUMN `countdownStart`,
    ADD COLUMN `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low';
