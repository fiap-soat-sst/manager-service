import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import UploadUseCase from '../UseCases/Video/upload/upload.usecase'
import Video from '../Entities/Video'
import { isLeft, Right } from '../@Shared/Either'
import SaveVideoDataUseCase from '../UseCases/Video/saveVideoData/saveVideoData.usecase'
import GetVideosUseCase from '../UseCases/Video/getVideos/getVideos.usecase'
import { generateHashFromBuffer } from '../@Shared/Crypto'
import CheckVideoHashUseCase from '../UseCases/Video/CheckVideo/CheckVideoHash.usecase'

export default class VideoController {
    constructor(
        private readonly uploadVideoUseCase: UploadUseCase,
        private readonly saveVideoDataUseCase: SaveVideoDataUseCase,
        private readonly getVideosUseCase: GetVideosUseCase,
        private readonly checkVideoHashUseCase: CheckVideoHashUseCase
    ) {}

    async uploadVideos(req: Request, res: Response): Promise<void> {
        const { file } = req
        if (!file) {
            res.status(400).json({ error: 'File is required' })
            return
        }

        const fileHash = generateHashFromBuffer(file.buffer)

        const checkVideoHash = await this.checkVideoHashUseCase.execute({
            email: req.email || '',
            hash: fileHash,
        })

        if (checkVideoHash && checkVideoHash.exists) {
            res.status(400).json({ message: 'Video already exists' })
            return
        }

        const video = new Video(
            uuidv4(),
            file.originalname,
            file.size,
            file.mimetype,
            fileHash
        )

        const result = await this.uploadVideoUseCase.execute({
            file: file.buffer,
            video,
        })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
            return
        }

        if (!video.managerService) {
            video.managerService = { url: '' }
        }

        video.managerService.url = result.value.url

        await this.saveVideoDataUseCase.execute({
            email: req.email || '',
            video,
        })

        res.status(200).json({ message: 'Video uploaded successfully' })
    }

    async getVideos(req: Request, res: Response): Promise<void> {
        const result = await this.getVideosUseCase.execute({
            email: req.email || '',
        })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
            return
        }

        res.status(200).json(result.value)
    }
}
