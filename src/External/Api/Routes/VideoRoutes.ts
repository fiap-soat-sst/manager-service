import { Router } from 'express'
import VideoController from '../../../Controllers/VideoController'

export default class VideoRoutes {
    private readonly videoController: VideoController

    constructor() {
        this.videoController = new VideoController()
    }

    buildRouter() {
        const router = Router()

        router.post('/upload', this.videoController.uploadVideos)

        return router
    }
}
