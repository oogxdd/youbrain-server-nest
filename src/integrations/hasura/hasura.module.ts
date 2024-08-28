import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HasuraService } from './hasura.service';

@Module({
  imports: [ConfigModule],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
