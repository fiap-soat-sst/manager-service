import { Request, Response, NextFunction } from 'express'
import VerifyAuthTokenUseCase from '../../../UseCases/Auth/verifyAuthToken/verifyAuthToken.usecase'
import { InputVerifyAuthTokenDto } from '../../../UseCases/Auth/verifyAuthToken/verifyAuthToken.dto'

export class AuthMiddleware {
    private verifyAuthTokenUseCase: VerifyAuthTokenUseCase

    constructor(verifyAuthTokenUseCase: VerifyAuthTokenUseCase) {
        this.verifyAuthTokenUseCase = verifyAuthTokenUseCase
    }

    handle(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'JWT token not provided' })
            return
        }

        const token = authHeader.split(' ')[1]

        const input: InputVerifyAuthTokenDto = { token }
        const result = this.verifyAuthTokenUseCase.execute(input)

        if (!result.isValid) {
            res.status(401).json({ error: result.error })
            return
        }

        req.email = result.payload.email || ''
        next()
    }
}
