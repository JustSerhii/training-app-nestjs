import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { ViewFullWorkoutDTO } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WorkoutsPdfService {
  constructor(private readonly usersService: UsersService) {}

  async generatePdf(
    userId: string,
    workout: ViewFullWorkoutDTO,
  ): Promise<Buffer> {
    return this.generatePdfInternal(userId, [workout], { isBulk: false });
  }

  async generateBulkPdf(
    userId: string,
    workouts: ViewFullWorkoutDTO[],
  ): Promise<Buffer> {
    return this.generatePdfInternal(userId, workouts, { isBulk: true });
  }

  private async generatePdfInternal(
    userId: string,
    workouts: ViewFullWorkoutDTO[],
    options: { isBulk: boolean },
  ): Promise<Buffer> {
    const user = await this.usersService.getUser(userId);
    const bodyweight = user.bodyWeight ?? null;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      if (options.isBulk && workouts.length > 1) {
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('Workouts Export', { align: 'center' });
        doc.moveDown(1);
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`Generated: ${new Date().toLocaleString()}`, {
            align: 'center',
          });
        doc.moveDown(2);
      }

      workouts.forEach((workout, index) => {
        if (options.isBulk && index > 0) {
          doc.addPage();
        }

        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .text(workout.title, { align: 'center' });
        doc.moveDown(0.5);
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`Date: ${new Date(workout.createdAt).toLocaleDateString()}`, {
            align: 'center',
          });
        doc.text(
          `Duration: ${Math.floor(workout.duration! / 60)}m ${workout.duration! % 60}s | Total Volume: ${workout.totalVolume} kg`,
          { align: 'center' },
        );
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        workout.workoutExercises.forEach((we, idx) => {
          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(`${idx + 1}. ${we.exercise.title}`, { underline: true });

          if (we.sets.length === 0) {
            doc
              .fontSize(10)
              .font('Helvetica-Oblique')
              .text('No sets recorded', { indent: 20 });
          } else {
            we.sets.forEach((set) => {
              const type = set.type === 'normal' ? '' : ` (${set.type})`;
              let weightLabel: string;

              if (we.exercise.isBodyWeight) {
                if (bodyweight != null) {
                  if (set.plateWeight != null) {
                    weightLabel =
                      set.plateWeight === 0
                        ? `BW(${bodyweight}kg)`
                        : `BW(${bodyweight}kg) + ${set.plateWeight}kg = ${bodyweight + set.plateWeight}kg`;
                  } else {
                    weightLabel = `BW(${bodyweight}kg)`;
                  }
                } else {
                  weightLabel =
                    set.plateWeight != null
                      ? `BW + ${set.plateWeight}kg`
                      : 'BW';
                }
              } else {
                weightLabel = set.weight != null ? `${set.weight}kg` : '0kg';
              }

              doc
                .fontSize(11)
                .font('Helvetica')
                .text(
                  `Set ${set.order}: ${weightLabel} × ${set.reps} reps${type}`,
                  {
                    indent: 20,
                  },
                );
            });
          }
          doc.moveDown(0.5);
        });
      });

      doc.end();
    });
  }
}
