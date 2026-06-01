type BetSelection = 'home' | 'draw' | 'away'
type BetStatus = 'pending' | 'won' | 'lost'

type BetModel = {
    id: string;
    user_id: string;
    match_id: string;
    amount: number;
    odds_at_placement: number;
    selection: BetSelection;
    status: BetStatus;
    created_at: Date;
}

export { BetModel, BetSelection, BetStatus }
