import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IVideoStorageGateway from '../../../Gateways/Contracts/IVideoStorageGateway'
import { InputUploadDto, OutputUploadDto } from './upload.dto'

export default class UploadUseCase {
    constructor(private readonly videoStorage: IVideoStorageGateway) {}

    async execute(
        input: InputUploadDto
    ): Promise<Either<Error, OutputUploadDto>> {
        const key = `${input.video.id}-${input.video.name}`

        const url = await this.videoStorage.upload(
            input.file,
            key,
            input.video.contentType
        )

        if (isLeft(url)) {
            return Left<Error>(new Error('Error to upload video'))
        }

        return Right({ url: url.value })
    }
}
