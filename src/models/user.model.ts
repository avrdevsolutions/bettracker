type UserRole = 'user' | 'admin'
type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected'

type UserModel = {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole
    balance: number;
    created_at: Date;
    updated_at: Date;
    kyc_status: KycStatus
    full_name: string;
    address: string;
}

type UserResponse = Omit<UserModel, 'password'>

type JwtPayload = {
    userId: string;
    email: string;
    role: UserRole;
}

export { UserResponse, JwtPayload, UserModel, KycStatus }
