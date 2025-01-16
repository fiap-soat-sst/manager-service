import { Router } from 'express'
import AuthController from '../../../Controllers/AuthController'
import LoginUseCase from '../../../UseCases/Auth/login/login.usecase'
import UserGatewayRepository from '../../../Gateways/User/UserGatewayRepository'
import DynamoDBUserRepository from '../../Database/Repositories/DatabaseRepository/DynamoDBUserRepository'
import { DynamoDBAdapter } from '../../Database/DynamoDbAdapter'
import RegisterUseCase from '../../../UseCases/Auth/register/register.usecase'

export default class AuthRoutes {
    private readonly authController: AuthController
    private readonly loginUseCase: LoginUseCase
    private readonly registerUseCase: RegisterUseCase
    private readonly userGatewayRepository: UserGatewayRepository
    private readonly userRepository: DynamoDBUserRepository
    private readonly adapterRepository: DynamoDBAdapter

    constructor() {
        this.adapterRepository = new DynamoDBAdapter()
        this.userRepository = new DynamoDBUserRepository(this.adapterRepository)
        this.userGatewayRepository = new UserGatewayRepository(
            this.userRepository
        )
        this.loginUseCase = new LoginUseCase(this.userGatewayRepository)
        this.registerUseCase = new RegisterUseCase(this.userGatewayRepository)
        this.authController = new AuthController(
            this.loginUseCase,
            this.registerUseCase
        )
    }

    buildRouter(): Router {
        const router = Router()

        router.post('/login', this.authController.login.bind(this))
        router.post('/register', this.authController.register.bind(this))

        return router
    }
}
