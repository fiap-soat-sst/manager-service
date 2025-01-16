import { Request, Response } from 'express'
import LoginUseCase from '../UseCases/Auth/login/login.usecase'
import { isLeft } from '../@Shared/Either'
import RegisterUseCase from '../UseCases/Auth/register/register.usecase'

export default class AuthController {
    private loginUseCase: LoginUseCase
    private registerUseCase: RegisterUseCase

    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase) {
        this.loginUseCase = loginUseCase
        this.registerUseCase = registerUseCase
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: 'Email e senha são obrigatórios.' })
            return
        }

        const result = await this.loginUseCase.execute({ email, password })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json(result.value)
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: 'Email e senha são obrigatórios.' })
            return
        }

        const result = await this.registerUseCase.execute({ email, password })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(201).json(result.value)
        }
    }
}
