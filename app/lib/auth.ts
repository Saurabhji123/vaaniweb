import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  lastReset?: Date;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  plan?: 'free' | 'starter' | 'pro' | 'ultra';
  sitesCreated?: number;
  monthlyLimit?: number;
  profilePicture?: string | null;
  authProvider?: 'email' | 'google';
  isEmailVerified?: boolean;
  emailVerificationOTP?: string;
  otpExpiry?: Date;
  verifiedAt?: Date;
}

export interface UserResponse {
  _id: string;
  email: string;
  name: string;
  plan: string;
  sitesCreated: number;
  monthlyLimit: number;
  profilePicture?: string | null;
  authProvider?: 'email' | 'google';
  hasPassword?: boolean;
  isEmailVerified?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function sanitizeUser(user: User): UserResponse {
  return {
    _id: user._id || '',
    email: user.email,
    name: user.name,
    plan: user.plan || 'free',
    sitesCreated: user.sitesCreated || 0,
    monthlyLimit: user.monthlyLimit || 5,
    profilePicture: user.profilePicture || null,
    authProvider: user.authProvider || 'email',
    hasPassword: !!user.password,
    isEmailVerified: user.isEmailVerified || false
  };
}

export function getPlanLimits(plan: string): number {
  switch (plan) {
    case 'free': return 5;
    case 'starter': return 50;
    case 'pro': return 200;
    case 'ultra': return -1; // unlimited
    default: return 5;
  }
}
