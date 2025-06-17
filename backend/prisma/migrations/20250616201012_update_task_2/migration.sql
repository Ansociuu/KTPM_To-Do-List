/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `isCompleted`,
    ADD COLUMN `status` ENUM('Pending', 'In_progress', 'Completed') NOT NULL DEFAULT 'Pending';
