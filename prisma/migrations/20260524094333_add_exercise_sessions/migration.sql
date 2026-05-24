-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "is_body_weight" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "exercise_session" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "workout_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "volume" REAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exercise_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exercise_session_user_id_exercise_id_created_at_idx" ON "exercise_session"("user_id", "exercise_id", "created_at");

-- CreateIndex
CREATE INDEX "exercise_session_user_id_workout_id_idx" ON "exercise_session"("user_id", "workout_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_session_workout_id_exercise_id_key" ON "exercise_session"("workout_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "exercise_session" ADD CONSTRAINT "exercise_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session" ADD CONSTRAINT "exercise_session_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session" ADD CONSTRAINT "exercise_session_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
