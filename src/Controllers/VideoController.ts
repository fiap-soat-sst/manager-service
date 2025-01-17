import { Request, Response } from 'express'
import UploadUseCase from '../UseCases/Video/upload/upload.usecase'
import Video from '../Entities/Video'
import { isLeft, Right } from '../@Shared/Either'
import SaveVideoDataUseCase from '../UseCases/Video/saveVideoData/saveVideoData.usecase'

export default class VideoController {
    constructor(
        private readonly uploadVideoUseCase: UploadUseCase,
        private readonly saveVideoDataUseCase: SaveVideoDataUseCase
    ) {}

    async uploadVideos(req: Request, res: Response): Promise<void> {
        const { file } = req
        if (!file) {
            res.status(400).json({ error: 'File is required' })
            return
        }

        const video = new Video(
            Date.now().toString(),
            file.originalname,
            file.size,
            file.mimetype
        )

        const result = await this.uploadVideoUseCase.execute({
            file: file.buffer,
            video,
        })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
            return
        }

        const url = result.value.url

        await this.saveVideoDataUseCase.execute({
            email: req.email || '',
            video,
            urlBucket: url,
        })

        res.status(200).json({ message: 'Video uploaded successfully' })
    }
}
