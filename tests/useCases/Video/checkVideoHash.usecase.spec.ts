import { describe, it, expect, vi } from 'vitest'
import CheckVideoHashUseCase from '../../../src/UseCases/Video/CheckVideo/CheckVideoHash.usecase'
import IUserGatewayRepository from '../../../src/Gateways/Contracts/IUserGatewayRepository'
import {
    InputCheckVideoHashDto,
    OutputCheckVideoHashDto,
} from '../../../src/UseCases/Video/CheckVideo/CheckVideoHash.dto'

describe('CheckVideoHashUseCase', () => {
    it('should return exists as true when the video exists', async () => {
        // Arrange
        const mockUserRepository: IUserGatewayRepository = {
            videoExists: vi.fn().mockResolvedValue(true),
            getUser: vi.fn(),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            getVideos: vi.fn(),
        }
        const useCase = new CheckVideoHashUseCase(mockUserRepository)
        const input: InputCheckVideoHashDto = {
            email: 'test@example.com',
            hash: '12345',
        }

        // Act
        const result: OutputCheckVideoHashDto = await useCase.execute(input)

        // Assert
        expect(result.exists).toBe(true)
        expect(mockUserRepository.videoExists).toHaveBeenCalledWith(
            'test@example.com',
            '12345'
        )
    })

    it('should return exists as false when the video does not exist', async () => {
        // Arrange
        const mockUserRepository: IUserGatewayRepository = {
            videoExists: vi.fn().mockResolvedValue(false),
            getUser: vi.fn(),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            getVideos: vi.fn(),
        }
        const useCase = new CheckVideoHashUseCase(mockUserRepository)
        const input: InputCheckVideoHashDto = {
            email: 'test@example.com',
            hash: '12345',
        }

        // Act
        const result: OutputCheckVideoHashDto = await useCase.execute(input)

        // Assert
        expect(result.exists).toBe(false)
        expect(mockUserRepository.videoExists).toHaveBeenCalledWith(
            'test@example.com',
            '12345'
        )
    })
})
