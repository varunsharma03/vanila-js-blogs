/*
  Warnings:

  - You are about to alter the column `descriptions` on the `blog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `blog` MODIFY `descriptions` JSON NULL;
