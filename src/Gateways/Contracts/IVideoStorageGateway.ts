import { Either } from '../../@Shared/Either'

export default interface IVideoStorageGateway {
    upload(
        file: Buffer,
        key: string,
        contentType: string
    ): Promise<Either<Error, string>>
}
