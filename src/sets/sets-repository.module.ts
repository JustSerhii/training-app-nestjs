import { Module } from '@nestjs/common';
import { SetsRepository } from './sets.repository';

@Module({
  imports: [],
  providers: [SetsRepository],
  exports: [SetsRepository],
})
export class SetsRepositoryModule {}
