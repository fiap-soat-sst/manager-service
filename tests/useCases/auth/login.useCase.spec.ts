import { describe, it, expect, vi, Mock } from 'vitest'
import LoginUseCase from '../../../src/UseCases/Auth/login/login.usecase'
import { Either, Left, Right } from '../../../src/@Shared/Either'
import IUserGatewayRepository from '../../../src/Gateways/Contracts/IUserGatewayRepository'
import { InputLoginDto } from '../../../src/UseCases/Auth/login/login.dto'
import { compare } from '../../../src/@Shared/Crypto'
import jwt from 'jsonwebtoken'
import User from '../../../src/Entities/User'

// Mockando os módulos
vi.mock('../../../src/@Shared/Crypto', () => ({
    compare: vi.fn(),
}))

vi.mock('jsonwebtoken')

describe('LoginUseCase', () => {
    const userRepository: IUserGatewayRepository = {
        getUser: vi.fn(),
        createUser: vi.fn(),
        saveVideoUser: vi.fn(),
        getVideos: vi.fn(),
        videoExists: vi.fn(),
    }

    const loginUseCase = new LoginUseCase(userRepository)

    const input: InputLoginDto = {
        email: 'test@example.com',
        password: 'password123',
    }

    it('should return an error if user is not found', async () => {
        userRepository.getUser = vi
            .fn()
            .mockResolvedValue(Left(new Error('User not found')))

        const result = await loginUseCase.execute(input)

        expect(result).toEqual(Left(new Error('Invalid user or password')))
    })

    it('should return an error if password is invalid', async () => {
        userRepository.getUser = vi
            .fn()
            .mockResolvedValue(
                Right({ email: 'test@example.com', password: 'hashedpassword' })
            )
        ;(compare as Mock).mockResolvedValue(false)

        const result = await loginUseCase.execute(input)

        expect(result).toEqual(Left(new Error('Invalid user or password')))
    })

    it('should return a token if login is successful', async () => {
        userRepository.getUser = vi
            .fn()
            .mockResolvedValue(
                Right({ email: 'test@example.com', password: 'hashedpassword' })
            )
        ;(compare as Mock).mockResolvedValue(true)

        const mockedSign = jwt.sign as Mock
        mockedSign.mockReturnValue('token')

        const result = await loginUseCase.execute(input)

        expect(result).toEqual(Right({ accessToken: 'token' }))
    })
})
