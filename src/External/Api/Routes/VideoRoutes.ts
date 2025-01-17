import { Router } from 'express'
import { makeAuthMiddleware } from '../Middlewares/AuthMiddlewareFactory'
import multer from 'multer'
import VideoController from '../../../Controllers/VideoController'
import UploadUseCase from '../../../UseCases/Video/upload/upload.usecase'
import VideoStorageGateway from '../../../Gateways/Video/VideoStorageGateway'
import S3StorageProvider from '../../Storage/Provider/S3StorageProvider'
import UserGatewayRepository from '../../../Gateways/User/UserGatewayRepository'
import DynamoDBUserRepository from '../../Database/Repositories/DatabaseRepository/DynamoDBUserRepository'
import { DynamoDBAdapter } from '../../Database/DynamoDbAdapter'
import SaveVideoDataUseCase from '../../../UseCases/Video/saveVideoData/saveVideoData.usecase'
import GetVideosUseCase from '../../../UseCases/Video/getVideos/getVideos.usecase'

export default class VideoRoutes {
    private readonly videoController: VideoController
    private readonly uploadVideoUseCase: UploadUseCase
    private readonly videoStorageGateway: VideoStorageGateway
    private readonly videoStorageProvider: S3StorageProvider
    private readonly userGatewayRepository: UserGatewayRepository
    private readonly userRepository: DynamoDBUserRepository
    private readonly adapterRepository: DynamoDBAdapter
    private readonly saveVideoDataUseCase: SaveVideoDataUseCase
    private readonly getVideosUseCase: GetVideosUseCase

    constructor() {
        this.videoStorageProvider = new S3StorageProvider()
        this.videoStorageGateway = new VideoStorageGateway(
            this.videoStorageProvider
        )
        this.adapterRepository = new DynamoDBAdapter()
        this.userRepository = new DynamoDBUserRepository(this.adapterRepository)
        this.userGatewayRepository = new UserGatewayRepository(
            this.userRepository
        )
        this.uploadVideoUseCase = new UploadUseCase(this.videoStorageGateway)
        this.saveVideoDataUseCase = new SaveVideoDataUseCase(
            this.userGatewayRepository
        )
        this.getVideosUseCase = new GetVideosUseCase(this.userGatewayRepository)
        this.videoController = new VideoController(
            this.uploadVideoUseCase,
            this.saveVideoDataUseCase,
            this.getVideosUseCase
        )
    }

    buildRouter() {
        const router = Router()
        const upload = multer()
        const authMiddleware = makeAuthMiddleware()

        router.get(
            '/',
            authMiddleware.handle.bind(authMiddleware),
            this.videoController.getVideos.bind(this)
        )

        router.post(
            '/upload',
            authMiddleware.handle.bind(authMiddleware),
            upload.single('video'),
            this.videoController.uploadVideos.bind(this)
        )

        return router
    }
}
