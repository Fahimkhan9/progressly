import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface JwtPayload {
  userid: string;
  email: string;
  // Add any other custom claims you need
}
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret'; 
export function generateJwtToken(payload: JwtPayload, expiresIn: string = '1d'): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn, // e.g., '1h', '7d'
    issuer: 'fahimalif',
  });

  return token;
}