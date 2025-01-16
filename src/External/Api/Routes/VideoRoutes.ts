import { Router } from 'express'
import multer from 'multer'
import VideoController from '../../../Controllers/VideoController'
import UploadUseCase from '../../../UseCases/Video/upload/upload.usecase'
import VideoStorageGateway from '../../../Gateways/Video/VideoStorageGateway'
import S3StorageProvider from '../../Storage/Provider/S3StorageProvider'

export default class VideoRoutes {
    private readonly videoController: VideoController
    private readonly uploadVideoUseCase: UploadUseCase
    private readonly videoStorageGateway: VideoStorageGateway
    private readonly videoStorageProvider: S3StorageProvider

    constructor() {
        this.videoStorageProvider = new S3StorageProvider()
        this.videoStorageGateway = new VideoStorageGateway(
            this.videoStorageProvider
        )
        this.uploadVideoUseCase = new UploadUseCase(this.videoStorageGateway)
        this.videoController = new VideoController(this.uploadVideoUseCase)
    }

    buildRouter() {
        const router = Router()
        const upload = multer()

        router.post(
            '/upload',
            upload.single('video'),
            this.videoController.uploadVideos.bind(this)
        )

        return router
    }
}
