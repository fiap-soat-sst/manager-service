import { AuthMiddleware } from './AuthMiddleware'
import VerifyAuthTokenUseCase from '../../../UseCases/Auth/verifyAuthToken/verifyAuthToken.usecase'
import dotenv from 'dotenv'

dotenv.config()

export const makeAuthMiddleware = (): AuthMiddleware => {
    const jwtSecret = process.env.JWT_SECRET || 'secret'
    const verifyTokenUseCase = new VerifyAuthTokenUseCase(jwtSecret)
    return new AuthMiddleware(verifyTokenUseCase)
}
