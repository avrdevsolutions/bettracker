import { useParams, Link } from 'react-router';
import { useMatch } from '@/hooks/useMatches';
import { formatOdds, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import { PlaceBetForm } from '@/components/forms/PlaceBetForm';

export function Component() {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useMatch(id!);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="skeleton h-52" />
        <div className="skeleton h-36" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="accent-left-loss rounded-r-md bg-loss-bg/50 p-6">
          <p className="text-[13px] text-loss">Match not found</p>
          <Link to="/matches" className="mt-2 inline-block text-[11px] text-primary hover:text-primary-hover">
            ← Back to matches
          </Link>
        </div>
      </div>
    );
  }

  const isLive = match.status === 'live';

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-5">
      {/* Back */}
      <Link
        to="/matches"
        className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-primary"
      >
        ← Matches
      </Link>

      {/* ── Match Hero ── */}
      <div className="card grain relative overflow-hidden">
        {/* Live glow */}
        {isLive && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-live to-transparent opacity-60" />
        )}

        <div className="relative p-6 pb-5">
          {/* Meta row */}
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[11px] text-text-muted">{formatDate(match.start_time)}</span>
            {isLive && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-live animate-pulse-live">
                <span className="inline-block h-[5px] w-[5px] animate-pulse-dot rounded-full bg-live" />
                Live
              </span>
            )}
          </div>

          {/* Teams — cinematic */}
          <div className="flex items-center">
            <div className="flex-1 text-right">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary sm:text-4xl">
                {match.home_team}
              </h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Home</p>
            </div>

            <div className="mx-5 flex flex-col items-center gap-1.5">
              <span className="font-display text-lg font-bold text-text-muted/50">VS</span>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            </div>

            <div className="flex-1 text-left">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary sm:text-4xl">
                {match.away_team}
              </h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Away</p>
            </div>
          </div>
        </div>

        <div className="divider-gradient" />

        {/* Odds row */}
        <div className="grid grid-cols-3">
          <OddsColumn label="Home" shortLabel="1" odds={match.odds_home} />
          <OddsColumn label="Draw" shortLabel="X" odds={match.odds_draw} border />
          <OddsColumn label="Away" shortLabel="2" odds={match.odds_away} />
        </div>
      </div>

      {/* ── Place Bet ── */}
      <PlaceBetForm match={match} />
    </div>
  );
}

Component.displayName = 'MatchDetailPage';

function OddsColumn({
  label,
  shortLabel,
  odds,
  border,
}: {
  label: string;
  shortLabel: string;
  odds: number | string;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        'group cursor-pointer p-5 text-center transition-colors hover:bg-primary-muted',
        border && 'border-x border-border-subtle',
      )}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">{label}</span>
        <span className="rounded bg-surface-overlay px-1 py-px font-display text-[9px] font-bold text-text-muted">
          {shortLabel}
        </span>
      </div>
      <p className="mt-2 font-mono text-3xl font-bold text-text-primary transition-colors group-hover:text-primary">
        {formatOdds(odds)}
      </p>
    </div>
  );
}
