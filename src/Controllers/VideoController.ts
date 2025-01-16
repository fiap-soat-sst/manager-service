import { Request, Response } from 'express'
import UploadUseCase from '../UseCases/Video/upload/upload.usecase'
import Video from '../Entities/Video'
import { isLeft } from '../@Shared/Either'

export default class VideoController {
    constructor(private readonly uploadVideoUseCase: UploadUseCase) {}

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
        } else {
            res.status(201).json(result.value)
        }
    }
}
