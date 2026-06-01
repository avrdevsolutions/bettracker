import {UserRepository} from "../repositories/user.repository.js";
import {UserModel, JwtPayload} from "../models/user.model.js";
import bcrypt from "bcrypt"
import {config} from "../config/index.js";
import jwt from 'jsonwebtoken';
import {ConflictError, InvalidCredentials, NotFoundError} from "../errors/AppError.js";

export class AuthService {
    constructor(private userRepo = new UserRepository()) {}

    async register(data: Pick<UserModel, 'email' | 'name' | 'password'>) {
        const { email, password, name } = data
        const emailExists = await this.userRepo.findByEmail(email)
        if(emailExists) throw new ConflictError('Email already registered');
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userRepo.create({password: hashedPassword, email, name})
        const { password: _, ...userResponse } = user;
        return userResponse;
    }

    async login(payload: Pick<UserModel, 'email' | 'password'>) {
        const { email, password } = payload

        const validUser = await this.userRepo.findByEmail(email)
        if(!validUser) throw new InvalidCredentials()
        const isValidPassword = await bcrypt.compare(password, validUser.password)
        if(!isValidPassword) throw new InvalidCredentials()
        const jwtPayload: JwtPayload = {
            userId: validUser.id,
            email: validUser.email,
            role: validUser.role
        };
        const token = jwt.sign(jwtPayload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        } as jwt.SignOptions);
        return { token, user: jwtPayload }
    }

    async findById(userId: string) {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundError('User not found');
        const { password: _, ...userResponse } = user
        return userResponse
    }
}

// ── Function-based equivalent ──
// No class, no constructor, no "this". Import the repo and call directly.
// The repo is created once at module level (Node modules are singletons).
//
// const userRepo = new UserRepository();
//
// export async function register(data: Pick<UserModel, 'email' | 'name' | 'password'>) {
//   const { email, password, name } = data;
//   const emailExists = await userRepo.findByEmail(email);
//   if (emailExists) throw Error('EMAIL_EXISTS');
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await userRepo.create({ password: hashedPassword, email, name });
//   const { password: _, ...userResponse } = user;
//   return userResponse;
// }
//
// export async function login(payload: Pick<UserModel, 'email' | 'password'>) {
//   const { email, password } = payload;
//   const validUser = await userRepo.findByEmail(email);
//   if (!validUser) throw Error('INVALID_CREDENTIALS');
//   const isMatch = await bcrypt.compare(password, validUser.password);
//   if (!isMatch) throw Error('INVALID_CREDENTIALS');
//   const jwtPayload: JwtPayload = { userId: validUser.id, email: validUser.email, role: validUser.role };
//   const token = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
//   return { token, user: jwtPayload };
// }