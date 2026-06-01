import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCurrentUser } from '@/hooks/useAuth';
import { usePlaceBet } from '@/hooks/useBets';
import { formatOdds, formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Match, BetSelection } from '@/types/api';

const MIN_BET = 1;

const selectionOptions: { key: BetSelection; label: string; shortLabel: string }[] = [
  { key: 'home', label: 'Home', shortLabel: '1' },
  { key: 'draw', label: 'Draw', shortLabel: 'X' },
  { key: 'away', label: 'Away', shortLabel: '2' },
];

function getOddsForSelection(match: Match, selection: BetSelection): number {
  const map: Record<BetSelection, number> = {
    home: Number(match.odds_home),
    draw: Number(match.odds_draw),
    away: Number(match.odds_away),
  };
  return map[selection];
}

function createBetSchema(balance: number) {
  return z.object({
    selection: z.enum(['home', 'draw', 'away'], {
      required_error: 'Pick an outcome',
    }),
    amount: z
      .number({ required_error: 'Enter a stake', invalid_type_error: 'Enter a valid amount' })
      .min(MIN_BET, `Minimum bet is ${formatCurrency(MIN_BET)}`)
      .max(balance, `Exceeds your balance of ${formatCurrency(balance)}`),
  });
}

type BetFormValues = z.infer<ReturnType<typeof createBetSchema>>;

export function PlaceBetForm({ match }: { match: Match }) {
  const { data: user } = useCurrentUser();
  const placeBet = usePlaceBet();

  // KYC gate
  if (!user || user.kyc_status !== 'verified') {
    return (
      <div className="rounded-lg bg-surface/40 py-10 text-center">
        <p className="text-[13px] text-text-muted">Bet placement requires KYC verification</p>
      </div>
    );
  }

  // Match must be open for betting
  if (match.status !== 'upcoming') {
    return (
      <div className="rounded-lg bg-surface/40 py-10 text-center">
        <p className="text-[13px] text-text-muted">Betting is closed for this match</p>
      </div>
    );
  }

  return <PlaceBetFormInner match={match} balance={user.balance} placeBet={placeBet} />;
}

/**
 * Inner form component — rendered only when KYC is verified and match is upcoming.
 * Separated so hooks (useForm) aren't called conditionally.
 */
function PlaceBetFormInner({
  match,
  balance,
  placeBet,
}: {
  match: Match;
  balance: number;
  placeBet: ReturnType<typeof usePlaceBet>;
}) {
  const schema = createBetSchema(Number(balance));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      selection: undefined,
      amount: undefined,
    },
  });

  const selection = watch('selection');
  const amount = watch('amount');

  const selectedOdds = selection ? getOddsForSelection(match, selection) : null;
  const payout = selectedOdds && amount ? amount * selectedOdds : null;

  const onSubmit = (data: BetFormValues) => {
    placeBet.mutate(
      { match_id: match.id, amount: data.amount, selection: data.selection },
      {
        onSuccess: () => reset(),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grain relative overflow-hidden">
      <div className="p-5 pb-4">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
          Place Bet
        </h3>
      </div>

      <div className="divider-gradient" />

      {/* ── Outcome selection (1 / X / 2) ── */}
      <div className="grid grid-cols-3">
        {selectionOptions.map(({ key, label, shortLabel }) => {
          const odds = getOddsForSelection(match, key);
          const isSelected = selection === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setValue('selection', key, { shouldValidate: true })}
              className={cn(
                'relative p-5 text-center transition-colors',
                key === 'draw' && 'border-x border-border-subtle',
                isSelected
                  ? 'bg-primary-muted'
                  : 'hover:bg-surface-raised/50',
              )}
            >
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary" />
              )}
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  {label}
                </span>
                <span className="rounded bg-surface-overlay px-1 py-px font-display text-[9px] font-bold text-text-muted">
                  {shortLabel}
                </span>
              </div>
              <p
                className={cn(
                  'mt-2 font-mono text-3xl font-bold transition-colors',
                  isSelected ? 'text-primary' : 'text-text-primary',
                )}
              >
                {formatOdds(odds)}
              </p>
            </button>
          );
        })}
      </div>
      {errors.selection && (
        <p className="px-5 pt-3 text-[11px] text-loss">{errors.selection.message}</p>
      )}

      <div className="divider-gradient" />

      {/* ── Stake input + payout ── */}
      <div className="space-y-4 p-5">
        <div>
          <label htmlFor="bet-amount" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Stake
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-text-muted">
              £
            </span>
            <input
              id="bet-amount"
              type="number"
              step="0.01"
              min={MIN_BET}
              className="input-field pl-7 font-mono"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-[11px] text-loss">{errors.amount.message}</p>
          )}
          <p className="mt-1.5 text-[10px] text-text-muted">
            Balance: <span className="font-mono text-text-secondary">{formatCurrency(balance)}</span>
          </p>
        </div>

        {/* Payout preview */}
        {selectedOdds && (
          <div className="flex items-center justify-between rounded-md bg-surface/60 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Odds
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-text-primary">
                {formatOdds(selectedOdds)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Potential Payout
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-win">
                {payout ? formatCurrency(payout) : '—'}
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={placeBet.isPending}
          className="btn-primary w-full text-sm"
        >
          {placeBet.isPending ? 'Placing bet...' : 'Place Bet'}
        </button>

        {/* Success / Error feedback */}
        {placeBet.isSuccess && (
          <p className="text-center text-[12px] text-win">Bet placed successfully</p>
        )}
        {placeBet.isError && (
          <p className="text-center text-[12px] text-loss">
            {(placeBet.error as Error)?.message ?? 'Failed to place bet'}
          </p>
        )}
      </div>
    </form>
  );
}
