/*
  Warnings:

  - You are about to drop the `Set` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workout_exercise_id_fkey";

-- DropTable
DROP TABLE "Set";

-- CreateTable
CREATE TABLE "set" (
    "id" UUID NOT NULL,
    "workout_exercise_id" UUID NOT NULL,
    "weight" REAL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "type" "set_type" NOT NULL,

    CONSTRAINT "set_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "set" ADD CONSTRAINT "set_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
