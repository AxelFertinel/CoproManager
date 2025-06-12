/*
  Warnings:

  - Added the required column `coproprieteId` to the `logements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logements` ADD COLUMN `coproprieteId` VARCHAR(191) NOT NULL;
