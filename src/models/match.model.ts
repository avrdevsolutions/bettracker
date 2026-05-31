type MatchStatus = 'upcoming' | 'live' | 'finished' | 'cancelled'

type MatchModel = {
    id: string;
    home_team: string;
    away_team: string;
    odds_home: number;
    odds_draw: number;
    odds_away: number;
    status: MatchStatus;
    start_time: Date;
    created_at: Date;
    updated_at: Date;
}

export { MatchModel, MatchStatus }
