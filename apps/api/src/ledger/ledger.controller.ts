import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function jsonBigInt(v: any): any {
  // Prisma returns BigInt for BigInt columns; JSON can’t serialize BigInt.
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'bigint') return v.toString();
  if (Array.isArray(v)) return v.map(jsonBigInt);
  if (v && typeof v === 'object') {
    const out: any = {};
    for (const [k, val] of Object.entries(v)) out[k] = jsonBigInt(val);
    return out;
  }
  return v;
}

@Controller('ledger')
export class LedgerController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('entries')
  async entries(
    @Query('take') takeStr?: string,
    @Query('skip') skipStr?: string,
  ) {
    const take = Math.min(Number(takeStr ?? 50), 200);
    const skip = Math.max(Number(skipStr ?? 0), 0);

    const rows = await this.prisma.ledgerEntry.findMany({
      orderBy: { occurredAt: 'desc' },
      take,
      skip,
      include: { account: true },
    });

    return jsonBigInt(rows);
  }

  @Get('balances')
  async balances() {
    // Group and sum balances by account + currency
    const grouped = await this.prisma.ledgerEntry.groupBy({
      by: ['accountCode', 'currency'],
      _sum: { amountCents: true },
    });

    // Normalize shape for UI
    const rows = grouped.map((g) => ({
      accountCode: g.accountCode,
      currency: g.currency,
      balanceCents: g._sum.amountCents ?? 0n,
    }));

    return jsonBigInt(rows);
  }
}