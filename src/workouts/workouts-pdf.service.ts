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
    const user = await this.usersService.getUser(userId);
    const bodyweight = user.bodyWeight ?? null;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

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
                  if (set.plateWeight === 0) {
                    weightLabel = `BW(${bodyweight}kg)`;
                  } else {
                    weightLabel = `BW(${bodyweight}kg) + ${set.plateWeight}kg = ${
                      bodyweight + set.plateWeight
                    }kg`;
                  }
                } else {
                  weightLabel = `BW(${bodyweight}kg)`;
                }
              } else {
                weightLabel =
                  set.plateWeight != null ? `BW + ${set.plateWeight}kg` : 'BW';
              }
            } else {
              if (set.weight != null) {
                weightLabel = `${set.weight}kg`;
              } else {
                weightLabel = '0kg';
              }
            }

            doc
              .fontSize(11)
              .font('Helvetica')
              .text(
                `Set ${set.order}: ${weightLabel} × ${set.reps} reps${type}`,
                { indent: 20 },
              );
          });
        }
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }
}
