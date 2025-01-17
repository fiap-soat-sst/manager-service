import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IUserGatewayRepository from '../../../Gateways/Contracts/IUserGatewayRepository'
import {
    InputSaveVideoDataDto,
    OutputSaveVideoDataDto,
} from './saveVideoData.dto'

export default class SaveVideoDataUseCase {
    constructor(private readonly userRepository: IUserGatewayRepository) {}

    async execute(
        input: InputSaveVideoDataDto
    ): Promise<Either<Error, OutputSaveVideoDataDto>> {
        const user = await this.userRepository.getUser(input.email)

        if (isLeft(user)) {
            return Left<Error>(new Error('User not found'))
        }

        user.value.videos.push(input.video)

        await this.userRepository.saveVideoUser(user.value, input.urlBucket)

        return Right({
            success: true,
        })
    }
}
