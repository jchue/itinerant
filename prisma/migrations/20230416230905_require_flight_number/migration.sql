/*
  Warnings:

  - Made the column `flight_number` on table `flight` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "flight" ALTER COLUMN "flight_number" SET NOT NULL;
