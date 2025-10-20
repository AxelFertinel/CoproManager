/*
  Warnings:

  - Made the column `startDate` on table `charges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `charges` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `charges` MODIFY `startDate` DATETIME(3) NOT NULL,
    MODIFY `endDate` DATETIME(3) NOT NULL;
