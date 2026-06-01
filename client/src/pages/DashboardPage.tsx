import { Link } from 'react-router';
import { useCurrentUser } from '@/hooks/useAuth';
import { useMatches } from '@/hooks/useMatches';
import { useMyBets } from '@/hooks/useBets';
import { formatCurrency, formatOdds } from '@/lib/format';
import { cn } from '@/lib/cn';

export function Component() {
  const { data: user } = useCurrentUser();
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: bets, isLoading: betsLoading } = useMyBets();

  const liveMatches = matches?.filter((m) => m.status === 'live') ?? [];
  const recentBets = bets?.slice(0, 5) ?? [];

  const activeBets = bets?.filter((b) => b.status === 'pending').length ?? 0;
  const wonBets = bets?.filter((b) => b.status === 'won').length ?? 0;
  const totalBets = bets?.length ?? 0;

  return (
    <div className="stagger space-y-6">
      {/* ── Hero block ── */}
      <div className="card grain relative overflow-hidden px-6 pb-5 pt-6">
        {/* Ambient glow inside */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary opacity-[0.04] blur-[80px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-text-primary">
              {user?.name ?? 'User'}
            </h2>
          </div>

          <div className="flex gap-2">
            <div className="stat-block" data-accent="primary">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">Balance</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-primary">
                {user ? formatCurrency(user.balance) : '—'}
              </p>
            </div>
            <div className="stat-block" data-accent="hot">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">Active</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-hot">{activeBets}</p>
            </div>
            <div className="stat-block" data-accent="win">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">Record</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-win">
                {totalBets > 0 ? `${wonBets}W` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Matches ── */}
      <section>
        <SectionHeader title="Live Now" link="/matches" />

        {matchesLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-[140px]" />)}
          </div>
        ) : liveMatches.length === 0 ? (
          <EmptyState message="No live matches" action="Browse upcoming" link="/matches" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="group card relative overflow-hidden p-4 transition-all duration-200 hover:border-primary-border hover:shadow-[0_0_20px_rgba(14,165,233,0.06)]"
              >
                {/* Live bar */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-live to-transparent opacity-50" />

                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-live">
                    <span className="inline-block h-[5px] w-[5px] animate-pulse-dot rounded-full bg-live" />
                    Live
                  </span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[13px] font-semibold text-text-primary">{match.home_team}</p>
                  <p className="font-display text-[10px] font-medium uppercase tracking-wider text-text-muted">vs</p>
                  <p className="text-[13px] font-semibold text-text-primary">{match.away_team}</p>
                </div>

                <div className="mt-3 flex gap-1">
                  {[
                    { label: '1', value: match.odds_home },
                    { label: 'X', value: match.odds_draw },
                    { label: '2', value: match.odds_away },
                  ].map((o) => (
                    <div
                      key={o.label}
                      className="flex-1 rounded bg-surface-raised py-1.5 text-center transition-colors group-hover:bg-surface-overlay"
                    >
                      <span className="block text-[9px] font-bold uppercase text-text-muted">{o.label}</span>
                      <span className="font-mono text-[13px] font-semibold text-text-primary">
                        {formatOdds(o.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent Bets ── */}
      <section>
        <SectionHeader title="Recent Bets" link="/bets" />

        {betsLoading ? (
          <div className="space-y-1.5">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-11" />)}
          </div>
        ) : recentBets.length === 0 ? (
          <EmptyState message="No bets yet" action="Place your first" link="/matches" />
        ) : (
          <div className="space-y-1">
            {recentBets.map((bet) => (
              <div
                key={bet.id}
                className="flex items-center justify-between rounded-md px-4 py-2.5 transition-colors hover:bg-surface/60"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-bold text-text-primary">
                    {formatCurrency(bet.amount)}
                  </span>
                  <span className="font-mono text-[11px] text-text-muted">
                    @{formatOdds(bet.odds_at_placement)}
                  </span>
                </div>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

Component.displayName = 'DashboardPage';

/* ── Sub-components ── */

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
        {title}
      </h3>
      <div className="h-px flex-1 bg-gradient-to-r from-border-subtle to-transparent" />
      <Link
        to={link}
        className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-primary"
      >
        View all ›
      </Link>
    </div>
  );
}

function EmptyState({
  message,
  action,
  link,
}: {
  message: string;
  action: string;
  link: string;
}) {
  return (
    <div className="rounded-lg bg-surface/40 py-10 text-center">
      <p className="text-[13px] text-text-muted">{message}</p>
      <Link to={link} className="mt-2 inline-block text-[12px] font-medium text-primary hover:text-primary-hover">
        {action}
      </Link>
    </div>
  );
}
