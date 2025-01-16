import { describe, it, expect } from 'vitest'
import { compare, encrypt } from '../../src/@Shared/Crypto'
import bcrypt from 'bcrypt'

describe('Crypto', () => {
    it('should return true when the text matches the hash', async () => {
        const text = 'password123'
        const hash = await bcrypt.hash(text, 10)

        const result = await compare(text, hash)

        expect(result).toBe(true)
    })

    it('should return false when the text does not match the hash', async () => {
        const text = 'password123'
        const hash = await bcrypt.hash('differentpassword', 10)

        const result = await compare(text, hash)

        expect(result).toBe(false)
    })

    it('should return a hashed string that is different from the original text', async () => {
        const text = 'password123'
        const hash = await encrypt(text)

        expect(hash).not.toBe(text)
    })

    it('should return a valid bcrypt hash', async () => {
        const text = 'password123'
        const hash = await encrypt(text)
        const isValidHash = await bcrypt.compare(text, hash)

        expect(isValidHash).toBe(true)
    })
})
