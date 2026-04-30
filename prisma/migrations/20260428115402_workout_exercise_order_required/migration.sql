/*
  Warnings:

  - Made the column `order` on table `workout_exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workout_exercise" ALTER COLUMN "order" SET NOT NULL;
