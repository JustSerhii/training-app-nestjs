-- CreateEnum
CREATE TYPE "muscle_group" AS ENUM ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'cardio');

-- CreateEnum
CREATE TYPE "set_type" AS ENUM ('warmup', 'failure', 'dropset', 'normal');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "muscle_groups" "muscle_group"[],

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercise" (
    "id" UUID NOT NULL,
    "description" VARCHAR NOT NULL,
    "workout_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,

    CONSTRAINT "workout_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" UUID NOT NULL,
    "workout_exercise_id" UUID NOT NULL,
    "weight" REAL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "type" "set_type" NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_title_key" ON "exercise"("title");

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
