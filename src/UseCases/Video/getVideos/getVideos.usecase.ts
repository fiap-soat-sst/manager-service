import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IUserGatewayRepository from '../../../Gateways/Contracts/IUserGatewayRepository'
import { InputGetVideosDto, OutputGetVideosDto } from './getVideos.dto'

export default class GetVideosUseCase {
    constructor(private readonly userRepository: IUserGatewayRepository) {}

    async execute(
        input: InputGetVideosDto
    ): Promise<Either<Error, OutputGetVideosDto>> {
        const videos = await this.userRepository.getVideos(input.email)

        if (isLeft(videos)) {
            return Left<Error>(new Error('Videos not found'))
        }

        return Right(videos.value)
    }
}
