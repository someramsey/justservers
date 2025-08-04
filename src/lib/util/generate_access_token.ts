import { createHash } from 'crypto';

export function generateAccessToken(robloxId: number, accessCode: string): string {
    return createHash('sha256').update(`${robloxId}${accessCode.trim().toUpperCase()}`).digest('hex');
}