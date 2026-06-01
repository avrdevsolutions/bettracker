import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const placeBetSchema = z.object({
  match_id: z.string().uuid(),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .max(10_000, 'Maximum bet is 10,000'),
  selection: z.enum(['home', 'draw', 'away'], {
    errorMap: () => ({ message: 'Select home, draw, or away' }),
  }),
});

export const kycProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
});

export const kycUploadSchema = z.object({
  doc_type: z.enum(['passport', 'driving_license', 'proof_of_address'], {
    errorMap: () => ({ message: 'Select a document type' }),
  }),
  full_name: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
});

export const createMatchSchema = z.object({
  home_team: z.string().min(1, 'Home team is required'),
  away_team: z.string().min(1, 'Away team is required'),
  odds_home: z.number().positive('Odds must be positive'),
  odds_draw: z.number().positive('Odds must be positive'),
  odds_away: z.number().positive('Odds must be positive'),
  status: z.enum(['upcoming', 'live', 'finished', 'cancelled'], {
    errorMap: () => ({ message: 'Select a valid status' }),
  }),
  start_time: z.string().min(1, 'Start time is required'),
});

export const updateOddsSchema = z.object({
  odds_home: z.number().positive('Odds must be positive'),
  odds_draw: z.number().positive('Odds must be positive'),
  odds_away: z.number().positive('Odds must be positive'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PlaceBetFormData = z.infer<typeof placeBetSchema>;
export type KycProfileFormData = z.infer<typeof kycProfileSchema>;
export type KycUploadFormData = z.infer<typeof kycUploadSchema>;
export type CreateMatchFormData = z.infer<typeof createMatchSchema>;
export type UpdateOddsFormData = z.infer<typeof updateOddsSchema>;
