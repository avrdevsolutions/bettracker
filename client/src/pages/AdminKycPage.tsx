import { useKycSubmissions, useKycVerify } from '@/hooks/useKyc';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { KycSubmission, DocType } from '@/types/api';

const docTypeLabels: Record<DocType, string> = {
  passport: 'Passport',
  driving_license: 'Driving License',
  proof_of_address: 'Proof of Address',
};

export function Component() {
  const { data: submissions, isLoading, error } = useKycSubmissions();

  if (isLoading) {
    return (
      <div>
        <div className="skeleton mb-5 h-10 w-48" />
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-loss-bg/50 p-5">
        <p className="text-[13px] text-loss">Failed to load KYC submissions</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
          KYC Review
        </h2>
        {submissions && submissions.length > 0 && (
          <span className="flex items-center gap-1 rounded bg-pending-bg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-pending">
            {submissions.length} pending
          </span>
        )}
      </div>

      {!submissions?.length ? (
        <div className="rounded-lg bg-surface/40 py-14 text-center">
          <p className="text-[13px] text-text-muted">No pending KYC submissions</p>
          <p className="mt-1 text-[11px] text-text-muted">Users who submit KYC will appear here for review</p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="mb-1 hidden items-center gap-4 px-4 lg:flex">
            <ColHeader className="w-40">User</ColHeader>
            <ColHeader className="flex-1">Email</ColHeader>
            <ColHeader className="w-40">Documents</ColHeader>
            <ColHeader className="w-28">Submitted</ColHeader>
            <ColHeader className="w-44 text-right">Actions</ColHeader>
          </div>

          <div className="divider-gradient mb-1 hidden lg:block" />

          <div className="stagger space-y-px">
            {submissions.map((submission) => (
              <SubmissionRow key={submission.id} submission={submission} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Component.displayName = 'AdminKycPage';

/* ─── Submission Row ─── */

function SubmissionRow({ submission }: { submission: KycSubmission }) {
  const verify = useKycVerify();

  const handleDecision = (approved: boolean) => {
    verify.mutate({ userId: submission.id, approved });
  };

  // Filter out null documents (from the LEFT JOIN when no docs exist)
  const docs = submission.documents?.filter((d) => d.id !== null) ?? [];

  return (
    <div className="flex flex-col gap-2 rounded-md px-4 py-3 transition-colors hover:bg-surface/50 lg:flex-row lg:items-center lg:gap-4">
      {/* User name */}
      <div className="w-40">
        <p className="text-[13px] font-medium text-text-primary">
          {submission.full_name || submission.name}
        </p>
      </div>

      {/* Email */}
      <div className="flex-1">
        <p className="text-[12px] text-text-secondary">{submission.email}</p>
      </div>

      {/* Document types */}
      <div className="flex w-40 flex-wrap gap-1">
        {docs.length > 0 ? (
          docs.map((doc) => (
            <span
              key={doc.id}
              className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-secondary"
            >
              {docTypeLabels[doc.doc_type] ?? doc.doc_type}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-text-muted">No documents</span>
        )}
      </div>

      {/* Date */}
      <span className="w-28 text-[11px] text-text-muted">
        {formatDate(submission.created_at)}
      </span>

      {/* Actions */}
      <div className="flex w-44 justify-end gap-2">
        {verify.isPending ? (
          <span className="font-display text-[10px] uppercase tracking-wider text-text-muted">
            Processing...
          </span>
        ) : (
          <>
            <button
              onClick={() => handleDecision(true)}
              className={cn(
                'rounded px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider transition-colors',
                'bg-win/10 text-win hover:bg-win/20',
              )}
            >
              Approve
            </button>
            <button
              onClick={() => handleDecision(false)}
              className={cn(
                'rounded px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider transition-colors',
                'bg-loss/10 text-loss hover:bg-loss/20',
              )}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
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
