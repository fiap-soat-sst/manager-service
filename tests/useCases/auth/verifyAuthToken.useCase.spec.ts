import { describe, it, expect, vi, Mock } from 'vitest'
import jwt from 'jsonwebtoken'
import VerifyAuthTokenUseCase from '../../../src/UseCases/Auth/verifyAuthToken/verifyAuthToken.usecase'
import {
    // FILE: src/UseCases/Auth/verifyAuthToken/verifyAuthToken.usecase.test.ts

    InputVerifyAuthTokenDto,
    OutputVerifyAuthTokenDto,
} from '../../../src/UseCases/Auth/verifyAuthToken/verifyAuthToken.dto'

// Mocking the jsonwebtoken module
vi.mock('jsonwebtoken')

describe('VerifyAuthTokenUseCase', () => {
    const jwtSecret = 'testsecret'
    const verifyAuthTokenUseCase = new VerifyAuthTokenUseCase(jwtSecret)

    it('should return an error if token is not provided', () => {
        const input: InputVerifyAuthTokenDto = { token: '' }

        const result: OutputVerifyAuthTokenDto =
            verifyAuthTokenUseCase.execute(input)

        expect(result).toEqual({
            isValid: false,
            error: 'Invalid Token',
        })
    })

    it('should return an error if token is invalid', () => {
        const input: InputVerifyAuthTokenDto = { token: 'invalidtoken' }
        const mockedVerify = jwt.verify as Mock
        mockedVerify.mockImplementation(() => {
            throw new Error('Invalid Token')
        })

        const result: OutputVerifyAuthTokenDto =
            verifyAuthTokenUseCase.execute(input)

        expect(result).toEqual({
            isValid: false,
            error: 'Invalid Token',
        })
    })

    it('should return payload if token is valid', () => {
        const input: InputVerifyAuthTokenDto = { token: 'validtoken' }
        const payload = { userId: '123' }
        const mockedVerify = jwt.verify as Mock
        mockedVerify.mockReturnValue(payload)

        const result: OutputVerifyAuthTokenDto =
            verifyAuthTokenUseCase.execute(input)

        expect(result).toEqual({
            isValid: true,
            payload,
        })
    })
})
