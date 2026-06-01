import { useState } from 'react';
import { useMyBets } from '@/hooks/useBets';
import { formatCurrency, formatOdds, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';

export function Component() {
  const [page, setPage] = useState(1);
  const { data: bets, isLoading, error } = useMyBets(page);

  if (isLoading) {
    return (
      <div>
        <div className="skeleton mb-5 h-10 w-32" />
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-11" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accent-left-loss rounded-r-md bg-loss-bg/50 p-5">
        <p className="text-[13px] text-loss">Failed to load bets</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
          My Bets
        </h2>
        {bets && bets.length > 0 && (
          <span className="font-mono text-[11px] text-text-muted">{bets.length} results</span>
        )}
      </div>

      {!bets?.length ? (
        <div className="rounded-lg bg-surface/40 py-14 text-center">
          <p className="text-[13px] text-text-muted">No bets placed</p>
          <p className="mt-1 text-[11px] text-text-muted">Browse matches to get started</p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="mb-1 hidden items-center gap-4 px-4 sm:flex">
            <ColHeader className="w-24">Date</ColHeader>
            <ColHeader className="flex-1">Selection</ColHeader>
            <ColHeader className="w-24 text-right">Stake</ColHeader>
            <ColHeader className="w-16 text-right">Odds</ColHeader>
            <ColHeader className="w-16 text-right">Status</ColHeader>
          </div>

          <div className="divider-gradient mb-1 hidden sm:block" />

          <div className="stagger space-y-px">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="flex flex-col gap-1 rounded-md px-4 py-2.5 transition-colors hover:bg-surface/50 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="w-24 text-[11px] text-text-muted">
                  {formatDate(bet.created_at)}
                </span>
                <span className="flex-1 text-[13px] font-medium capitalize text-text-primary">
                  {bet.selection}
                </span>
                <span className="w-24 text-right font-mono text-[13px] font-bold text-text-primary">
                  {formatCurrency(bet.amount)}
                </span>
                <span className="w-16 text-right font-mono text-[11px] text-text-secondary">
                  {formatOdds(bet.odds_at_placement)}
                </span>
                <span className="w-16 text-right">
                  <span
                    className={cn(
                      'font-display text-[10px] font-semibold uppercase tracking-[0.15em]',
                      bet.status === 'won' && 'text-win',
                      bet.status === 'lost' && 'text-loss',
                      bet.status === 'pending' && 'text-pending',
                    )}
                  >
                    {bet.status}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded bg-surface px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary disabled:opacity-25"
            >
              ← Prev
            </button>
            <span className="font-mono text-[11px] text-text-muted">{page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!bets.length || bets.length < 20}
              className="rounded bg-surface px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary disabled:opacity-25"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

Component.displayName = 'MyBetsPage';

function ColHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted', className)}>
      {children}
    </span>
  );
}
