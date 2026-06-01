import { useCurrentUser } from '@/hooks/useAuth';
import { KycUploadForm } from '@/components/forms/KycUploadForm';
import { cn } from '@/lib/cn';
import type { KycStatus } from '@/types/api';

/**
 * KYC page — shows different content based on kyc_status.
 *
 * TODO: discuss with Vlad — this is the discriminated union pattern in practice.
 * The KYC state machine (pending → submitted → verified/rejected) maps perfectly
 * to discriminated unions from 17.4.
 */

const steps = ['Pending', 'Submitted', 'Verified'] as const;

function getStepIndex(status: KycStatus): number {
  switch (status) {
    case 'pending': return 0;
    case 'submitted': return 1;
    case 'verified': return 2;
    case 'rejected': return 1;
  }
}

export function Component() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-16" />
        <div className="skeleton h-36" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl accent-left-loss rounded-r-md bg-loss-bg/50 p-5">
        <p className="text-[13px] text-loss">Failed to load profile</p>
      </div>
    );
  }

  const currentStep = getStepIndex(user.kyc_status);
  const isRejected = user.kyc_status === 'rejected';

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h2 className="mb-7 font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
        KYC Verification
      </h2>

      {/* ── Status track ── */}
      <div className="mb-7 flex items-center gap-1">
        {steps.map((step, i) => {
          const done = i < currentStep && !isRejected;
          const active = i === currentStep;
          const rejected = isRejected && i === 1;

          return (
            <div key={step} className="flex flex-1 flex-col gap-2">
              {/* Bar segment */}
              <div
                className={cn(
                  'h-1 rounded-full transition-colors',
                  done && 'bg-win',
                  active && !rejected && 'bg-primary',
                  rejected && 'bg-loss',
                  !done && !active && !rejected && 'bg-border-subtle',
                )}
              />
              {/* Label */}
              <span
                className={cn(
                  'font-display text-[9px] font-semibold uppercase tracking-[0.15em]',
                  done && 'text-win',
                  active && !rejected && 'text-primary',
                  rejected && 'text-loss',
                  !done && !active && !rejected && 'text-text-muted',
                )}
              >
                {rejected ? 'Rejected' : step}
              </span>
            </div>
          );
        })}
      </div>

      <KycStatusView status={user.kyc_status} />
    </div>
  );
}

Component.displayName = 'KycPage';

function KycStatusView({ status }: { status: KycStatus }) {
  switch (status) {
    case 'pending':
      return (
        <div className="space-y-5">
          <div className="accent-left-pending rounded-r-md bg-pending-bg/50 py-4 pl-4 pr-5">
            <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-pending">
              Verification Required
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
              Upload a government-issued ID and fill in your personal details to start placing bets.
            </p>
          </div>

          <KycUploadForm />
        </div>
      );

    case 'submitted':
      return (
        <div className="card grain relative overflow-hidden p-8 text-center">
          <div className="relative">
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-primary">
              Under Review
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-text-secondary">
              Your documents have been submitted. This usually takes 1–2 business days.
            </p>
          </div>
        </div>
      );

    case 'verified':
      return (
        <div className="card relative overflow-hidden p-8 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-win to-transparent" />
          <div className="relative">
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-win">
              Verified
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-text-secondary">
              Your identity has been verified. You're all set to place bets.
            </p>
          </div>
        </div>
      );

    case 'rejected':
      return (
        <div className="space-y-5">
          <div className="accent-left-loss rounded-r-md bg-loss-bg/50 py-4 pl-4 pr-5">
            <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-loss">
              Verification Rejected
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
              Your documents were not accepted. Ensure your ID is clearly readable and not expired.
            </p>
          </div>

          <KycUploadForm />
        </div>
      );
  }
}
