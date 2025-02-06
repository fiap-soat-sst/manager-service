import { describe, it, expect, vi } from 'vitest'
import GetVideosUseCase from '../../../src/UseCases/Video/getVideos/getVideos.usecase'
import IUserGatewayRepository from '../../../src/Gateways/Contracts/IUserGatewayRepository'
import {
    InputGetVideosDto,
    OutputGetVideosDto,
} from '../../../src/UseCases/Video/getVideos/getVideos.dto'
import { Left, Right } from '../../../src/@Shared/Either'

// FILE: src/UseCases/Video/getVideos/getVideos.usecase.test.ts

describe('GetVideosUseCase', () => {
    it('should return videos when found', async () => {
        // Arrange
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi
                .fn()
                .mockResolvedValue(Right([{ id: '1', title: 'Video 1' }])),
            getUser: vi.fn(),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            videoExists: vi.fn(),
        }
        const useCase = new GetVideosUseCase(mockUserRepository)
        const input: InputGetVideosDto = { email: 'test@example.com' }
        const result = await useCase.execute(input)

        if (Right(result)) {
            expect(result.value).toEqual([{ id: '1', title: 'Video 1' }])
        }
        expect(mockUserRepository.getVideos).toHaveBeenCalledWith(
            'test@example.com'
        )
    })

    it('should return an error when videos are not found', async () => {
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi
                .fn()
                .mockResolvedValue(Left(new Error('Videos not found'))),
            getUser: vi.fn(),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            videoExists: vi.fn(),
        }
        const useCase = new GetVideosUseCase(mockUserRepository)
        const input: InputGetVideosDto = { email: 'test@example.com' }
        const result = await useCase.execute(input)

        if (Left(result)) {
            if (result.value instanceof Error) {
                expect(result.value.message).toBe('Videos not found')
            }
        }
        expect(mockUserRepository.getVideos).toHaveBeenCalledWith(
            'test@example.com'
        )
    })
})
