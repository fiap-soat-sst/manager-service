import bcrypt from 'bcrypt'
import crypto from 'crypto'

const saltRounds = 10

export async function encrypt(text: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(text, salt)
    return hash
}

export async function compare(text: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(text, hash)
    return match
}

export function generateHashFromBuffer(buffer: Buffer): string {
    const hash = crypto.createHash('sha256')
    hash.update(buffer)
    return hash.digest('hex')
}
