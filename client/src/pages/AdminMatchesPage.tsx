import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMatches, useCreateMatch, useUpdateOdds, useUpdateMatchStatus } from '@/hooks/useMatches';
import {
  createMatchSchema,
  updateOddsSchema,
  type CreateMatchFormData,
  type UpdateOddsFormData,
} from '@/lib/validators';
import { formatOdds, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Match, MatchStatus } from '@/types/api';

const statusConfig: Record<MatchStatus, { color: string; label: string }> = {
  live: { color: 'text-live', label: 'LIVE' },
  upcoming: { color: 'text-primary', label: 'UPCOMING' },
  finished: { color: 'text-text-muted', label: 'FINISHED' },
  cancelled: { color: 'text-loss', label: 'CANCELLED' },
};

const STATUS_OPTIONS: MatchStatus[] = ['upcoming', 'live', 'finished', 'cancelled'];

export function Component() {
  const { data: matches, isLoading, error } = useMatches();
  const [editingOdds, setEditingOdds] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div>
        <div className="skeleton mb-5 h-10 w-56" />
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-14" />)}
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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
            Manage Matches
          </h2>
          {matches && (
            <span className="font-mono text-[12px] text-text-muted">{matches.length}</span>
          )}
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary font-display text-[11px] uppercase tracking-wider"
        >
          {showCreateForm ? 'Cancel' : 'Create Match'}
        </button>
      </div>

      {/* Create Match Form */}
      {showCreateForm && (
        <CreateMatchForm onClose={() => setShowCreateForm(false)} />
      )}

      {/* Matches Table */}
      {!matches?.length ? (
        <div className="rounded-lg bg-surface/40 py-14 text-center">
          <p className="text-[13px] text-text-muted">No matches yet</p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="mb-1 hidden items-center gap-4 px-4 lg:flex">
            <ColHeader className="w-32">Date</ColHeader>
            <ColHeader className="flex-1">Match</ColHeader>
            <ColHeader className="w-20 text-center">Home</ColHeader>
            <ColHeader className="w-20 text-center">Draw</ColHeader>
            <ColHeader className="w-20 text-center">Away</ColHeader>
            <ColHeader className="w-28 text-center">Status</ColHeader>
            <ColHeader className="w-20 text-center">Actions</ColHeader>
          </div>

          <div className="divider-gradient mb-1 hidden lg:block" />

          <div className="stagger space-y-px">
            {matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                isEditingOdds={editingOdds === match.id}
                onEditOdds={() => setEditingOdds(editingOdds === match.id ? null : match.id)}
                onCancelEditOdds={() => setEditingOdds(null)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Component.displayName = 'AdminMatchesPage';

/* ─── Create Match Form ─── */

function CreateMatchForm({ onClose }: { onClose: () => void }) {
  const createMatch = useCreateMatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMatchFormData>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      status: 'upcoming',
    },
  });

  const onSubmit = (data: CreateMatchFormData) => {
    createMatch.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="card mb-5 overflow-hidden p-5 animate-fade-in-scale">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
        New Match
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Home Team */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Home Team
          </label>
          <input
            {...register('home_team')}
            className="input-field"
            placeholder="e.g. Arsenal"
          />
          {errors.home_team && (
            <p className="mt-1 text-[11px] text-loss">{errors.home_team.message}</p>
          )}
        </div>

        {/* Away Team */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Away Team
          </label>
          <input
            {...register('away_team')}
            className="input-field"
            placeholder="e.g. Chelsea"
          />
          {errors.away_team && (
            <p className="mt-1 text-[11px] text-loss">{errors.away_team.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register('start_time')}
            className="input-field"
          />
          {errors.start_time && (
            <p className="mt-1 text-[11px] text-loss">{errors.start_time.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Status
          </label>
          <select {...register('status')} className="input-field">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-[11px] text-loss">{errors.status.message}</p>
          )}
        </div>

        {/* Odds Home */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Odds Home (1)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('odds_home', { valueAsNumber: true })}
            className="input-field font-mono"
            placeholder="1.50"
          />
          {errors.odds_home && (
            <p className="mt-1 text-[11px] text-loss">{errors.odds_home.message}</p>
          )}
        </div>

        {/* Odds Draw */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Odds Draw (X)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('odds_draw', { valueAsNumber: true })}
            className="input-field font-mono"
            placeholder="3.00"
          />
          {errors.odds_draw && (
            <p className="mt-1 text-[11px] text-loss">{errors.odds_draw.message}</p>
          )}
        </div>

        {/* Odds Away */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Odds Away (2)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('odds_away', { valueAsNumber: true })}
            className="input-field font-mono"
            placeholder="4.20"
          />
          {errors.odds_away && (
            <p className="mt-1 text-[11px] text-loss">{errors.odds_away.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={createMatch.isPending}
            className="btn-primary w-full font-display text-[11px] uppercase tracking-wider"
          >
            {createMatch.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>

        {createMatch.error && (
          <div className="col-span-full rounded bg-loss-bg/50 py-2 px-3">
            <p className="text-[11px] text-loss">Failed to create match</p>
          </div>
        )}
      </form>
    </div>
  );
}

/* ─── Match Row ─── */

function MatchRow({
  match,
  isEditingOdds,
  onEditOdds,
  onCancelEditOdds,
}: {
  match: Match;
  isEditingOdds: boolean;
  onEditOdds: () => void;
  onCancelEditOdds: () => void;
}) {
  const updateStatus = useUpdateMatchStatus();
  const config = statusConfig[match.status];

  const handleStatusChange = (newStatus: MatchStatus) => {
    updateStatus.mutate({ id: match.id, data: { status: newStatus } });
  };

  return (
    <div className="rounded-md px-4 py-3 transition-colors hover:bg-surface/50">
      {/* Main row */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
        {/* Date */}
        <span className="w-32 text-[11px] text-text-muted">
          {formatDate(match.start_time)}
        </span>

        {/* Teams */}
        <span className="flex-1 text-[13px] font-medium text-text-primary">
          {match.home_team}
          <span className="mx-1.5 font-display text-[11px] font-medium uppercase text-text-muted">vs</span>
          {match.away_team}
        </span>

        {/* Odds */}
        <span className="w-20 text-center font-mono text-[13px] text-text-primary">{formatOdds(match.odds_home)}</span>
        <span className="w-20 text-center font-mono text-[13px] text-text-primary">{formatOdds(match.odds_draw)}</span>
        <span className="w-20 text-center font-mono text-[13px] text-text-primary">{formatOdds(match.odds_away)}</span>

        {/* Status selector */}
        <div className="w-28 text-center">
          <select
            value={match.status}
            onChange={(e) => handleStatusChange(e.target.value as MatchStatus)}
            disabled={updateStatus.isPending}
            className={cn(
              'w-full cursor-pointer rounded bg-transparent px-2 py-1 text-center font-display text-[10px] font-semibold uppercase tracking-wider transition-colors',
              'border border-border-subtle focus:border-primary focus:outline-none',
              config.color,
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface text-text-primary">
                {statusConfig[s].label}
              </option>
            ))}
          </select>
        </div>

        {/* Edit odds button */}
        <div className="w-20 text-center">
          <button
            onClick={onEditOdds}
            className="rounded bg-surface px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            {isEditingOdds ? 'Close' : 'Odds'}
          </button>
        </div>
      </div>

      {/* Inline odds edit */}
      {isEditingOdds && (
        <OddsEditForm match={match} onClose={onCancelEditOdds} />
      )}
    </div>
  );
}

/* ─── Odds Edit Form ─── */

function OddsEditForm({ match, onClose }: { match: Match; onClose: () => void }) {
  const updateOdds = useUpdateOdds();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOddsFormData>({
    resolver: zodResolver(updateOddsSchema),
    defaultValues: {
      odds_home: Number(match.odds_home),
      odds_draw: Number(match.odds_draw),
      odds_away: Number(match.odds_away),
    },
  });

  const onSubmit = (data: UpdateOddsFormData) => {
    updateOdds.mutate(
      { id: match.id, data },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 flex items-end gap-3 border-t border-border-subtle pt-3 animate-fade-in"
    >
      <div className="flex-1">
        <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
          Home (1)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('odds_home', { valueAsNumber: true })}
          className="input-field font-mono text-[13px]"
        />
        {errors.odds_home && (
          <p className="mt-0.5 text-[10px] text-loss">{errors.odds_home.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
          Draw (X)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('odds_draw', { valueAsNumber: true })}
          className="input-field font-mono text-[13px]"
        />
        {errors.odds_draw && (
          <p className="mt-0.5 text-[10px] text-loss">{errors.odds_draw.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
          Away (2)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('odds_away', { valueAsNumber: true })}
          className="input-field font-mono text-[13px]"
        />
        {errors.odds_away && (
          <p className="mt-0.5 text-[10px] text-loss">{errors.odds_away.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={updateOdds.isPending}
        className="btn-primary shrink-0 font-display text-[10px] uppercase tracking-wider"
      >
        {updateOdds.isPending ? 'Saving...' : 'Save'}
      </button>

      {updateOdds.error && (
        <p className="text-[10px] text-loss">Failed</p>
      )}
    </form>
  );
}

/* ─── Helpers ─── */

function ColHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted', className)}>
      {children}
    </span>
  );
}
