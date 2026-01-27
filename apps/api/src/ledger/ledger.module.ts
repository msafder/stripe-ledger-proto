import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';

@Module({
  providers: [LedgerService],
  controllers: [LedgerController],
  exports: [LedgerService]
})
export class LedgerModule {}
