import { encrypt } from '../../../@Shared/Crypto'
import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IUserGatewayRepository from '../../../Gateways/Contracts/IUserGatewayRepository'
import { InputRegisterDto, OutputRegisterDto } from './register.dto'

export default class RegisterUseCase {
    constructor(private readonly userRepository: IUserGatewayRepository) {}

    async execute(
        input: InputRegisterDto
    ): Promise<Either<Error, OutputRegisterDto>> {
        const user = await this.userRepository.getUser(input.email)

        if (!isLeft(user)) {
            return Left<Error>(new Error('Email already registered'))
        }

        const hashedPassword = await encrypt(input.password)

        input.password = hashedPassword

        await this.userRepository.createUser(input)

        return Right({
            message: 'User registered successfully.',
        })
    }
}
