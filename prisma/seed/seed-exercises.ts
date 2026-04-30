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
    },
    {
      title: 'Incline Dumbbell Press',
      muscleGroups: [MuscleGroup.chest, MuscleGroup.shoulders],
    },
    { title: 'Dips', muscleGroups: [MuscleGroup.chest, MuscleGroup.triceps] },

    // Back
    { title: 'Pull-ups', muscleGroups: [MuscleGroup.back, MuscleGroup.biceps] },
    {
      title: 'Deadlift',
      muscleGroups: [
        MuscleGroup.back,
        MuscleGroup.hamstrings,
        MuscleGroup.glutes,
      ],
    },
    {
      title: 'Bent Over Row',
      muscleGroups: [MuscleGroup.back, MuscleGroup.biceps],
    },
    { title: 'Lat Pulldown', muscleGroups: [MuscleGroup.back] },

    // Legs
    {
      title: 'Barbell Squat',
      muscleGroups: [MuscleGroup.quadriceps, MuscleGroup.glutes],
    },
    { title: 'Leg Press', muscleGroups: [MuscleGroup.quadriceps] },
    {
      title: 'Lunges',
      muscleGroups: [MuscleGroup.quadriceps, MuscleGroup.glutes],
    },
    { title: 'Calf Raises', muscleGroups: [MuscleGroup.calves] },

    // Shoulders
    {
      title: 'Overhead Press',
      muscleGroups: [MuscleGroup.shoulders, MuscleGroup.triceps],
    },
    { title: 'Lateral Raises', muscleGroups: [MuscleGroup.shoulders] },

    // Arms
    { title: 'Barbell Curl', muscleGroups: [MuscleGroup.biceps] },
    {
      title: 'Hammer Curls',
      muscleGroups: [MuscleGroup.biceps, MuscleGroup.forearms],
    },
    { title: 'Skull Crushers', muscleGroups: [MuscleGroup.triceps] },

    // Abs & Cardio
    { title: 'Plank', muscleGroups: [MuscleGroup.abs] },
    { title: 'Crunches', muscleGroups: [MuscleGroup.abs] },
    { title: 'Running', muscleGroups: [MuscleGroup.cardio] },
  ];

  console.log('Seeding exercises');

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { title: exercise.title },
      update: { muscleGroups: exercise.muscleGroups },
      create: {
        title: exercise.title,
        muscleGroups: exercise.muscleGroups,
      },
    });
  }

  console.log(`Successfully seeded/updated ${exercises.length} exercises.`);
};
