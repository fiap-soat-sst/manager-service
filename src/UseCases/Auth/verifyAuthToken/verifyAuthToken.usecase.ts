import jwt from 'jsonwebtoken'
import {
    InputVerifyAuthTokenDto,
    OutputVerifyAuthTokenDto,
} from './verifyAuthToken.dto'

export default class VerifyAuthTokenUseCase {
    constructor(private jwtSecret: string) {}

    execute(input: InputVerifyAuthTokenDto): OutputVerifyAuthTokenDto {
        if (!input.token) {
            return {
                isValid: false,
                error: 'Invalid Token',
            }
        }

        try {
            const payload = jwt.verify(input.token, this.jwtSecret, {
                algorithms: ['HS256'],
            })
            return {
                isValid: true,
                payload,
            }
        } catch (error) {
            return {
                isValid: false,
                error: 'Invalid Token',
            }
        }
    }
}
