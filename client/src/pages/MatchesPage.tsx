import { Link } from 'react-router';
import { useMatches } from '@/hooks/useMatches';
import { formatOdds, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { MatchStatus } from '@/types/api';

const statusConfig: Record<MatchStatus, { color: string; label: string }> = {
  live: { color: 'text-live', label: 'LIVE' },
  upcoming: { color: 'text-primary', label: 'SOON' },
  finished: { color: 'text-text-muted', label: 'FT' },
  cancelled: { color: 'text-loss', label: 'CANC' },
};

export function Component() {
  const { data: matches, isLoading, error } = useMatches();

  if (isLoading) {
    return (
      <div>
        <div className="skeleton mb-5 h-10 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-[180px]" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-loss-bg/50 p-5">
        <p className="text-[13px] text-loss">Failed to load matches</p>
      </div>
    );
  }

  const liveCount = matches?.filter((m) => m.status === 'live').length ?? 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
          Matches
        </h2>
        {matches && (
          <span className="font-mono text-[12px] text-text-muted">{matches.length}</span>
        )}
        {liveCount > 0 && (
          <span className="flex items-center gap-1 rounded bg-live-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-live">
            <span className="inline-block h-[4px] w-[4px] animate-pulse-dot rounded-full bg-live" />
            {liveCount} live
          </span>
        )}
      </div>

      {!matches?.length ? (
        <div className="rounded-lg bg-surface/40 py-14 text-center">
          <p className="text-[13px] text-text-muted">No matches available</p>
        </div>
      ) : (
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => {
            const config = statusConfig[match.status];
            const isLive = match.status === 'live';

            return (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className={cn(
                  'group card relative overflow-hidden transition-all duration-200 hover:border-primary-border hover:shadow-[0_0_20px_rgba(14,165,233,0.06)]',
                  isLive && 'border-live/20',
                )}
              >
                {/* Live top glow */}
                {isLive && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-live to-transparent opacity-50" />
                )}

                {/* Match info */}
                <div className="p-4 pb-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">{formatDate(match.start_time)}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 font-display text-[10px] font-semibold uppercase tracking-wider',
                        config.color,
                      )}
                    >
                      {isLive && (
                        <span className="inline-block h-[4px] w-[4px] animate-pulse-dot rounded-full bg-live" />
                      )}
                      {config.label}
                    </span>
                  </div>

                  <p className="text-[14px] font-semibold text-text-primary">
                    {match.home_team}
                    <span className="mx-1.5 font-display text-[11px] font-medium uppercase text-text-muted">vs</span>
                    {match.away_team}
                  </p>
                </div>

                {/* Odds row */}
                <div className="grid grid-cols-3 border-t border-border-subtle">
                  {[
                    { label: '1', odds: match.odds_home },
                    { label: 'X', odds: match.odds_draw },
                    { label: '2', odds: match.odds_away },
                  ].map((o, i) => (
                    <div
                      key={o.label}
                      className={cn(
                        'px-3 py-2.5 text-center transition-colors group-hover:bg-surface-raised/50',
                        i === 1 && 'border-x border-border-subtle',
                      )}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{o.label}</span>
                      <p className="mt-0.5 font-mono text-[15px] font-bold text-text-primary transition-colors group-hover:text-primary">
                        {formatOdds(o.odds)}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

Component.displayName = 'MatchesPage';
