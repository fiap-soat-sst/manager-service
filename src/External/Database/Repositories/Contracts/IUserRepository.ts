import { Either } from '../../../../@Shared/Either'

export default interface IUserRepository {
    getUser(
        email: string
    ): Promise<Either<Error, { email: string; password: string }>>
    createUser(input: { email: string; password: string }): Promise<void>
}
