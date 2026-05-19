-- CreateTable
CREATE TABLE "routine" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_exercise" (
    "id" UUID NOT NULL,
    "routine_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "routine_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_set" (
    "id" UUID NOT NULL,
    "routine_exercise_id" UUID NOT NULL,
    "target_reps" INTEGER NOT NULL,
    "target_weight" REAL,
    "type" "set_type" NOT NULL DEFAULT 'normal',
    "order" INTEGER NOT NULL,

    CONSTRAINT "routine_set_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercise" ADD CONSTRAINT "routine_exercise_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercise" ADD CONSTRAINT "routine_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_set" ADD CONSTRAINT "routine_set_routine_exercise_id_fkey" FOREIGN KEY ("routine_exercise_id") REFERENCES "routine_exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
