/*
  Warnings:

  - Made the column `departure_timestamp` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrival_timestamp` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departure_timezone_name` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrival_timezone_name` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `checkin_timestamp` on table `stay` required. This step will fail if there are existing NULL values in that column.
  - Made the column `checkout_timestamp` on table `stay` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone_name` on table `stay` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "flight" ALTER COLUMN "departure_timestamp" SET NOT NULL,
ALTER COLUMN "arrival_timestamp" SET NOT NULL,
ALTER COLUMN "departure_timezone_name" SET NOT NULL,
ALTER COLUMN "arrival_timezone_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "stay" ALTER COLUMN "checkin_timestamp" SET NOT NULL,
ALTER COLUMN "checkout_timestamp" SET NOT NULL,
ALTER COLUMN "timezone_name" SET NOT NULL;
