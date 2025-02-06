import { describe, it, expect, vi } from 'vitest'
import SaveVideoDataUseCase from '../../../src/UseCases/Video/saveVideoData/saveVideoData.usecase'
import IUserGatewayRepository from '../../../src/Gateways/Contracts/IUserGatewayRepository'
import { isLeft, Left, Right } from '../../../src/@Shared/Either'

describe('SaveVideoDataUseCase', () => {
    it('should initialize userRepository correctly', () => {
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi.fn(),
            getUser: vi.fn(),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            videoExists: vi.fn(),
        }

        const useCase = new SaveVideoDataUseCase(mockUserRepository)

        expect(useCase['userRepository']).toBe(mockUserRepository)
    })

    it('should call getUser with correct email', async () => {
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi.fn(),
            getUser: vi
                .fn()
                .mockResolvedValue(
                    Right({ email: 'test@example.com', videos: [] })
                ),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            videoExists: vi.fn(),
        }

        const useCase = new SaveVideoDataUseCase(mockUserRepository)
        const input = {
            email: 'test@example.com',
            video: {
                id: '1',
                title: 'video1',
                name: 'video1',
                size: 100,
                contentType: 'video/mp4',
                hash: 'abc123',
            },
        }

        await useCase.execute(input)

        expect(mockUserRepository.getUser).toHaveBeenCalledWith(
            'test@example.com'
        )
    })

    it('should return error if user is not found', async () => {
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi.fn(),
            getUser: vi
                .fn()
                .mockResolvedValue(Left(new Error('User not found'))),
            createUser: vi.fn(),
            saveVideoUser: vi.fn(),
            videoExists: vi.fn(),
        }

        const useCase = new SaveVideoDataUseCase(mockUserRepository)
        const input = {
            email: 'test@example.com',
            video: {
                id: '1',
                title: 'video1',
                name: 'video1',
                size: 100,
                contentType: 'video/mp4',
                hash: 'abc123',
            },
        }

        const result = await useCase.execute(input)

        expect(isLeft(result)).toBe(true)
        if (isLeft(result)) {
            expect(result.value.message).toBe('User not found')
        }
    })

    it('should save video to user and return success', async () => {
        const mockUserRepository: IUserGatewayRepository = {
            getVideos: vi.fn(),
            getUser: vi
                .fn()
                .mockResolvedValue(
                    Right({ email: 'test@example.com', videos: [] })
                ),
            createUser: vi.fn(),
            saveVideoUser: vi.fn().mockResolvedValue(undefined),
            videoExists: vi.fn(),
        }

        const useCase = new SaveVideoDataUseCase(mockUserRepository)
        const input = {
            email: 'test@example.com',
            video: {
                id: '1',
                title: 'video1',
                name: 'video1',
                size: 100,
                contentType: 'video/mp4',
                hash: 'abc123',
            },
        }

        const result = await useCase.execute(input)

        expect(isLeft(result)).toBe(false)
        if (!isLeft(result)) {
            expect(result.value.success).toBe(true)
        }
        expect(mockUserRepository.saveVideoUser).toHaveBeenCalledWith({
            email: 'test@example.com',
            videos: [
                {
                    id: '1',
                    title: 'video1',
                    name: 'video1',
                    size: 100,
                    contentType: 'video/mp4',
                    hash: 'abc123',
                },
            ],
        })
    })
})
