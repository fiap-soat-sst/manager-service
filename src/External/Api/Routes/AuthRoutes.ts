import { Router } from 'express'
import AuthController from '../../../Controllers/AuthController'

export default class AuthRoutes {
    private readonly authController: AuthController

    constructor() {
        this.authController = new AuthController()
    }

    buildRouter(): Router {
        const router = Router()

        router.post('/login', this.authController.login)
        router.post('/register', this.authController.register)

        return router
    }
}
