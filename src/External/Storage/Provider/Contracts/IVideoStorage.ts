import { Either } from '../../../../@Shared/Either'

export default interface IVideoStorage {
    upload(
        file: Buffer,
        key: string,
        contentType: string
    ): Promise<Either<Error, string>>
}
