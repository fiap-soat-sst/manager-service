import { Either } from '../../../../@Shared/Either'
import User from '../../../../Entities/User'

export default interface IUserRepository {
    getUser(email: string): Promise<Either<Error, User>>
    createUser(input: { email: string; password: string }): Promise<void>
    saveVideoUser(user: User): Promise<void>
    getVideos(email: string): Promise<
        Either<
            Error,
            {
                email: string
                videos: [
                    {
                        id: string
                        name: string
                        size: number
                        contentType: string
                        managerService?: { url: string } | undefined
                        processService?:
                            | { images: { url: string }[] }
                            | undefined
                        compressService?: { url: string } | undefined
                    }
                ]
            }
        >
    >
    videoExists(email: string, hash: string): Promise<boolean>
}
