import { Link } from 'react-router';

export function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6">
      <div className="animate-fade-in text-center">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-text-muted">
          404
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide text-text-primary">
          Off the board
        </h1>
        <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <p className="mt-5 text-[13px] text-text-secondary">
          This page doesn't exist or has been taken down.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-[12px] font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

Component.displayName = 'NotFoundPage';
