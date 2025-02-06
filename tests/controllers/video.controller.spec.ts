import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import VideoController from '../../src/Controllers/VideoController'
import UploadUseCase from '../../src/UseCases/Video/upload/upload.usecase'
import SaveVideoDataUseCase from '../../src/UseCases/Video/saveVideoData/saveVideoData.usecase'
import GetVideosUseCase from '../../src/UseCases/Video/getVideos/getVideos.usecase'
import CheckVideoHashUseCase from '../../src/UseCases/Video/CheckVideo/CheckVideoHash.usecase'
import PublishUseCase from '../../src/UseCases/Queue/publish/publish.usecase'
import { Left, Right } from '../../src/@Shared/Either'

vi.mock('uuid', () => ({
    v4: vi.fn(() => 'uuid-mock'),
}))

vi.mock('../@Shared/Crypto', () => ({
    generateHashFromBuffer: vi.fn(() => 'hash-mock'),
}))

describe('VideoController', () => {
    let uploadUseCase: UploadUseCase
    let saveVideoDataUseCase: SaveVideoDataUseCase
    let getVideosUseCase: GetVideosUseCase
    let checkVideoHashUseCase: CheckVideoHashUseCase
    let publishUseCase: PublishUseCase
    let videoController: VideoController
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        uploadUseCase = {
            execute: vi.fn(),
        } as unknown as UploadUseCase

        saveVideoDataUseCase = {
            execute: vi.fn(),
        } as unknown as SaveVideoDataUseCase

        getVideosUseCase = {
            execute: vi.fn(),
        } as unknown as GetVideosUseCase

        checkVideoHashUseCase = {
            execute: vi.fn(),
        } as unknown as CheckVideoHashUseCase

        publishUseCase = {
            execute: vi.fn(),
        } as unknown as PublishUseCase

        videoController = new VideoController(
            uploadUseCase,
            saveVideoDataUseCase,
            getVideosUseCase,
            checkVideoHashUseCase,
            publishUseCase
        )

        req = {
            file: {
                buffer: Buffer.from('test'),
                originalname: 'test.mp4',
                size: 1234,
                mimetype: 'video/mp4',
            },
            email: 'test@example.com',
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }
    })

    it('should return 400 if no file is provided', async () => {
        req.file = undefined

        await videoController.uploadVideos(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'File is required' })
    })

    it('should return 400 if video already exists', async () => {
        checkVideoHashUseCase.execute = vi
            .fn()
            .mockResolvedValue({ exists: true })

        await videoController.uploadVideos(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Video already exists',
        })
    })

    it('should return 400 if upload fails', async () => {
        checkVideoHashUseCase.execute = vi
            .fn()
            .mockResolvedValue({ exists: false })
        uploadUseCase.execute = vi
            .fn()
            .mockResolvedValue(Left(new Error('Upload failed')))

        await videoController.uploadVideos(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Upload failed')
    })

    it('should upload video and return 200 on success', async () => {
        checkVideoHashUseCase.execute = vi
            .fn()
            .mockResolvedValue({ exists: false })
        uploadUseCase.execute = vi
            .fn()
            .mockResolvedValue(Right({ url: 'http://example.com/video' }))
        saveVideoDataUseCase.execute = vi.fn().mockResolvedValue(Right({}))
        publishUseCase.execute = vi.fn().mockResolvedValue(Right({}))

        await videoController.uploadVideos(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Video uploaded successfully',
        })
    })
})
