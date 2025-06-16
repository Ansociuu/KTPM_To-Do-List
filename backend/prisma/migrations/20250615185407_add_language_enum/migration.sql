/*
  Warnings:

  - You are about to alter the column `language` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `language` ENUM('vi', 'en', 'ja') NOT NULL DEFAULT 'vi';
