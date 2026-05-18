-- AlterTable
ALTER TABLE "user" ADD COLUMN     "body_weight" REAL;

-- CreateTable
CREATE TABLE "exercise_record" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "max_weight" REAL NOT NULL,
    "max_reps" INTEGER NOT NULL,
    "max_volume" REAL NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exercise_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercise_record_user_id_exercise_id_key" ON "exercise_record"("user_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "exercise_record" ADD CONSTRAINT "exercise_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_record" ADD CONSTRAINT "exercise_record_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
