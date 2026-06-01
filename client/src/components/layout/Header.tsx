import { NavLink } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout, useCurrentUser } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';

type NavItem = {
  label: string;
  to: string;
};

const userNav: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Matches', to: '/matches' },
  { label: 'My Bets', to: '/bets' },
];

const adminNav: NavItem[] = [
  { label: 'Manage Matches', to: '/admin/matches' },
  { label: 'KYC Review', to: '/admin/kyc' },
];

export function Header({ kycBlocked }: { kycBlocked: boolean }) {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.user?.role);
  const { data: profile } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="relative z-10 flex h-11 items-center bg-void/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-2.5 px-5">
        <img src="/logo.svg" alt="BetTracker" className="h-5 w-5" />
        <span className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
          BetTracker
        </span>
      </div>

      {/* Nav — hidden during KYC flow */}
      {!kycBlocked && (
        <nav className="flex items-center gap-0.5">
          {userNav.map((item) => (
            <HeaderLink key={item.to} {...item} />
          ))}

          {role === 'admin' && (
            <>
              <div className="mx-2 h-4 w-px bg-border" />
              {adminNav.map((item) => (
                <HeaderLink key={item.to} {...item} />
              ))}
            </>
          )}
        </nav>
      )}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3 px-5">
        {profile && !kycBlocked && (
          <span className="font-mono text-[13px] font-semibold text-primary">
            {formatCurrency(profile.balance)}
          </span>
        )}

        {!kycBlocked && <div className="h-4 w-px bg-border" />}

        <span className="hidden text-[12px] text-text-muted sm:inline">{user?.email}</span>

        <button
          onClick={logout}
          className="rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-loss"
        >
          Log out
        </button>
      </div>

      {/* Bottom line */}
      <div className="divider-gradient absolute inset-x-0 bottom-0" />
    </header>
  );
}

function HeaderLink({ label, to }: NavItem) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'relative px-3 py-2.5 text-[12px] font-medium transition-colors',
          isActive
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <div className="absolute inset-x-3 bottom-0 h-[2px] bg-primary shadow-[0_1px_6px_rgba(14,165,233,0.3)]" />
          )}
        </>
      )}
    </NavLink>
  );
}
