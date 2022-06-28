/*
  Warnings:

  - Added the required column `user_id` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `stay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flight" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "stay" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "user_id" UUID NOT NULL;
