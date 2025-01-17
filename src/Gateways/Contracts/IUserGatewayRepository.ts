import { Either } from '../../@Shared/Either'
import User from '../../Entities/User'

export default interface IUserGatewayRepository {
    getUser(email: string): Promise<Either<Error, User>>
    createUser(input: { email: string; password: string }): Promise<void>
    saveVideoUser(user: User, urlBucket: string): Promise<void>
}
