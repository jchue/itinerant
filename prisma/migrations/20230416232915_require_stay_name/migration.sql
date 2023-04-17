/*
  Warnings:

  - Made the column `name` on table `stay` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stay" ALTER COLUMN "name" SET NOT NULL;
