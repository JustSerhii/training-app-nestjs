/*
  Warnings:

  - Added the required column `best_reps` to the `exercise_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `best_weight` to the `exercise_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercise_record" ADD COLUMN     "best_reps" INTEGER NOT NULL,
ADD COLUMN     "best_weight" REAL NOT NULL;
