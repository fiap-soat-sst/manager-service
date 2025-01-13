import { Request, Response } from 'express'

export default class VideoController {
    constructor() {}

    async uploadVideos(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'uploadVideos' })
    }
}
