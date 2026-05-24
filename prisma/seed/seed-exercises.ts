import { PrismaClient, MuscleGroup } from '@prisma/client';

export const seedExercises = async (prisma: PrismaClient): Promise<void> => {
  const exercises = [
    // Chest
    {
      title: 'Bench Press',
      muscleGroups: [
        MuscleGroup.chest,
        MuscleGroup.triceps,
        MuscleGroup.shoulders,
      ],
      isBodyWeight: false,
    },
    {
      title: 'Incline Dumbbell Press',
      muscleGroups: [MuscleGroup.chest, MuscleGroup.shoulders],
      isBodyWeight: false,
    },
    {
      title: 'Dips',
      muscleGroups: [MuscleGroup.chest, MuscleGroup.triceps],
      isBodyWeight: true,
    },

    // Back
    {
      title: 'Pull-ups',
      muscleGroups: [MuscleGroup.back, MuscleGroup.biceps],
      isBodyWeight: true,
    },
    {
      title: 'Deadlift',
      muscleGroups: [
        MuscleGroup.back,
        MuscleGroup.hamstrings,
        MuscleGroup.glutes,
      ],
      isBodyWeight: false,
    },
    {
      title: 'Bent Over Row',
      muscleGroups: [MuscleGroup.back, MuscleGroup.biceps],
      isBodyWeight: false,
    },
    {
      title: 'Lat Pulldown',
      muscleGroups: [MuscleGroup.back],
      isBodyWeight: false,
    },

    // Legs
    {
      title: 'Barbell Squat',
      muscleGroups: [MuscleGroup.quadriceps, MuscleGroup.glutes],
      isBodyWeight: false,
    },
    {
      title: 'Leg Press',
      muscleGroups: [MuscleGroup.quadriceps],
      isBodyWeight: false,
    },
    {
      title: 'Lunges',
      muscleGroups: [MuscleGroup.quadriceps, MuscleGroup.glutes],
      isBodyWeight: false,
    },
    {
      title: 'Calf Raises',
      muscleGroups: [MuscleGroup.calves],
      isBodyWeight: false,
    },

    // Shoulders
    {
      title: 'Overhead Press',
      muscleGroups: [MuscleGroup.shoulders, MuscleGroup.triceps],
      isBodyWeight: false,
    },
    {
      title: 'Lateral Raises',
      muscleGroups: [MuscleGroup.shoulders],
      isBodyWeight: false,
    },

    // Arms
    {
      title: 'Barbell Curl',
      muscleGroups: [MuscleGroup.biceps],
      isBodyWeight: false,
    },
    {
      title: 'Hammer Curls',
      muscleGroups: [MuscleGroup.biceps, MuscleGroup.forearms],
      isBodyWeight: false,
    },
    {
      title: 'Skull Crushers',
      muscleGroups: [MuscleGroup.triceps],
      isBodyWeight: false,
    },

    // Abs & Cardio
    {
      title: 'Plank',
      muscleGroups: [MuscleGroup.abs],
      isBodyWeight: false,
    },
    {
      title: 'Crunches',
      muscleGroups: [MuscleGroup.abs],
      isBodyWeight: false,
    },
    {
      title: 'Running',
      muscleGroups: [MuscleGroup.cardio],
      isBodyWeight: false,
    },
  ];

  console.log('Seeding exercises...');

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { title: exercise.title },
      update: {
        muscleGroups: exercise.muscleGroups,
        isBodyWeight: exercise.isBodyWeight,
      },
      create: {
        title: exercise.title,
        muscleGroups: exercise.muscleGroups,
        isBodyWeight: exercise.isBodyWeight,
      },
    });
  }

  const bodyWeightCount = exercises.filter((e) => e.isBodyWeight).length;
  console.log(
    `Successfully seeded ${exercises.length} exercises (${bodyWeightCount} bodyweight).`,
  );
};
