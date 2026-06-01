import {UserModel} from "../models/user.model.js";
import {pool} from "../config/database.js";

export class UserRepository {

    async findByEmail(email: UserModel['email']) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || undefined;
    }

    async findById(id: UserModel['id']) {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || undefined;
    }

    async create(user: Pick<UserModel, 'password' | 'email' | 'name'>) {
        const result = await pool.query(
            'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *',
            [user.email, user.name, user.password]
        );
        return result.rows[0];
    }
}

// ── Function-based equivalent ──
// The module-level array replaces "private users" — Node modules are
// singletons, so this array is shared across all imports (same behavior).
//
// import { UserModel } from '../models/user.model.js';
//
// const users: UserModel[] = [];
//
// export async function findByEmail(email: string) {
//   return users.find(user => user.email === email);
// }
//
// export async function findById(id: string) {
//   return users.find(user => user.id === id);
// }
//
// export async function create(user: Pick<UserModel, 'password' | 'email' | 'name'>) {
//   const newUser: UserModel = {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     role: 'user',
//     balance: 1000,
//     ...user,
//   };
//   users.push(newUser);
//   return newUser;
// }
