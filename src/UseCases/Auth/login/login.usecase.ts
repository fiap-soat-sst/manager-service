import { compare } from '../../../@Shared/Crypto'
import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IUserGatewayRepository from '../../../Gateways/Contracts/IUserGatewayRepository'
import { InputLoginDto, OutputLoginDto } from './login.dto'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

export default class LoginUseCase {
    constructor(private readonly userRepository: IUserGatewayRepository) {}

    async execute(
        input: InputLoginDto
    ): Promise<Either<Error, OutputLoginDto>> {
        const user = await this.userRepository.getUser(input.email)

        if (isLeft(user)) {
            return Left<Error>(new Error('Invalid user or password'))
        }

        const isPasswordValid = await compare(
            input.password,
            user.value.password
        )

        if (!isPasswordValid) {
            return Left<Error>(new Error('Invalid user or password'))
        }

        const token = jwt.sign({ email: user.value.email }, SECRET, {
            expiresIn: '30m',
        })

        return Right({
            accessToken: token,
        })
    }
}
