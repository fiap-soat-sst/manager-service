import IUserGatewayRepository from '../../../Gateways/Contracts/IUserGatewayRepository'
import {
    InputCheckVideoHashDto,
    OutputCheckVideoHashDto,
} from './CheckVideoHash.dto'

export default class CheckVideoHashUseCase {
    constructor(private readonly userRepository: IUserGatewayRepository) {}

    async execute(
        input: InputCheckVideoHashDto
    ): Promise<OutputCheckVideoHashDto> {
        const { email, hash } = input

        const exists = await this.userRepository.videoExists(email, hash)

        return {
            exists,
        }
    }
}
