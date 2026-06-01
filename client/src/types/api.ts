// ── Auth ──
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  token: string;
  user: {
    userId: string;
    email: string;
    role: UserRole;
  };
};

// ── User ──
export type UserRole = 'user' | 'admin';
export type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  balance: number;
  kyc_status: KycStatus;
  full_name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

// ── Match ──
export type MatchStatus = 'upcoming' | 'live' | 'finished' | 'cancelled';

export type Match = {
  id: string;
  home_team: string;
  away_team: string;
  odds_home: number;
  odds_draw: number;
  odds_away: number;
  status: MatchStatus;
  start_time: string;
  created_at: string;
  updated_at: string;
};

export type CreateMatchRequest = {
  home_team: string;
  away_team: string;
  odds_home: number;
  odds_draw: number;
  odds_away: number;
  status: MatchStatus;
  start_time: string;
};

export type UpdateOddsRequest = {
  odds_home: number;
  odds_draw: number;
  odds_away: number;
};

export type UpdateStatusRequest = {
  status: MatchStatus;
};

// ── Bet ──
export type BetSelection = 'home' | 'draw' | 'away';
export type BetStatus = 'pending' | 'won' | 'lost';

export type Bet = {
  id: string;
  user_id: string;
  match_id: string;
  amount: number;
  odds_at_placement: number;
  selection: BetSelection;
  status: BetStatus;
  created_at: string;
};

export type PlaceBetRequest = {
  match_id: string;
  amount: number;
  selection: BetSelection;
};

// ── KYC ──
export type DocType = 'passport' | 'proof_of_address' | 'driving_license';
export type DocStatus = 'pending' | 'approved' | 'rejected';

export type KycDocument = {
  id: string;
  user_id: string;
  doc_type: DocType;
  s3_key: string;
  status: DocStatus;
  created_at: string;
};

export type KycUploadResponse = {
  uploadUrl: string;
  document: {
    id: string;
    doc_type: DocType;
    s3_key: string;
  };
};

export type KycSubmission = {
  id: string;
  email: string;
  name: string;
  full_name: string;
  kyc_status: KycStatus;
  created_at: string;
  documents: {
    id: string;
    doc_type: DocType;
    status: DocStatus;
    created_at: string;
  }[];
};

// ── Paginated response ──
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

// ── WebSocket ──
export type OddsUpdateMessage = {
  type: 'odds_update';
  matchId: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
};
