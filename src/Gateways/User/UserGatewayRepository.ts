import { Either } from '../../@Shared/Either'
import IUserRepository from '../../External/Database/Repositories/Contracts/IUserRepository'
import IUserGatewayRepository from '../Contracts/IUserGatewayRepository'

export default class UserGatewayRepository implements IUserGatewayRepository {
    constructor(private readonly repository: IUserRepository) {}

    async getUser(
        email: string
    ): Promise<Either<Error, { email: string; password: string }>> {
        return this.repository.getUser(email)
    }

    async createUser(input: {
        email: string
        password: string
    }): Promise<void> {
        return this.repository.createUser(input)
    }
}
