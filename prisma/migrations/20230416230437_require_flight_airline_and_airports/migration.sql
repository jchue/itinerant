/*
  Warnings:

  - Made the column `airline_code` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departure_airport_code` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrival_airport_code` on table `flight` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "flight" ALTER COLUMN "airline_code" SET NOT NULL,
ALTER COLUMN "departure_airport_code" SET NOT NULL,
ALTER COLUMN "arrival_airport_code" SET NOT NULL;
