-- DropForeignKey
ALTER TABLE "set" DROP CONSTRAINT "set_workout_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "workout_exercise" DROP CONSTRAINT "workout_exercise_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "workout_exercise" DROP CONSTRAINT "workout_exercise_workout_id_fkey";

-- AlterTable
ALTER TABLE "set" ALTER COLUMN "type" SET DEFAULT 'normal';

-- AlterTable
ALTER TABLE "workout_exercise" ADD COLUMN     "order" INTEGER;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set" ADD CONSTRAINT "set_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
