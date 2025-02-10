import { describe, it, expect, vi, Mock } from 'vitest'
import RegisterUseCase from '../../../src/UseCases/Auth/register/register.usecase'
import { Left, Right } from '../../../src/@Shared/Either'
import IUserGatewayRepository from '../../../src/Gateways/Contracts/IUserGatewayRepository'
import { InputRegisterDto } from '../../../src/UseCases/Auth/register/register.dto'
import { encrypt } from '../../../src/@Shared/Crypto'

// Mocking the modules
vi.mock('../../../src/@Shared/Crypto', () => ({
    encrypt: vi.fn(),
}))

describe('RegisterUseCase', () => {
    const userRepository: IUserGatewayRepository = {
        getUser: vi.fn(),
        createUser: vi.fn(),
        saveVideoUser: vi.fn(),
        getVideos: vi.fn(),
        videoExists: vi.fn(),

    }

    const registerUseCase = new RegisterUseCase(userRepository)

    const input: InputRegisterDto = {
        email: 'test@example.com',
        password: 'password123',
    }

    it('should return an error if email is already registered', async () => {
        userRepository.getUser = vi
            .fn()
            .mockResolvedValue(Right({ email: 'test@example.com' }))

        const result = await registerUseCase.execute(input)

        expect(result).toEqual(Left(new Error('Email already registered')))
    })

    it('should hash the password and create a new user', async () => {
        userRepository.getUser = vi
            .fn()
            .mockResolvedValue(Left(new Error('User not found')))
        ;(encrypt as Mock).mockResolvedValue('hashedpassword')

        const result = await registerUseCase.execute(input)

        expect(encrypt).toHaveBeenCalledWith('password123')
        expect(userRepository.createUser).toHaveBeenCalledWith({
            ...input,
            password: 'hashedpassword',
        })
        expect(result).toEqual(
            Right({ message: 'User registered successfully.' })
        )
    })
})
