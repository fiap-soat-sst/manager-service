import { Request, Response } from 'express'

export default class AuthController {
    constructor() {}

    async login(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'login' })
    }

    async register(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'register' })
    }
}
