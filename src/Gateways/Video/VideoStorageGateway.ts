import { Either } from '../../@Shared/Either'
import IVideoStorage from '../../External/Storage/Provider/Contracts/IVideoStorage'
import IVideoStorageGateway from '../Contracts/IVideoStorageGateway'

export default class VideoStorageGateway implements IVideoStorageGateway {
    constructor(private readonly storageProvider: IVideoStorage) {}

    async upload(
        file: Buffer,
        key: string,
        contentType: string
    ): Promise<Either<Error, string>> {
        return this.storageProvider.upload(file, key, contentType)
    }
}
