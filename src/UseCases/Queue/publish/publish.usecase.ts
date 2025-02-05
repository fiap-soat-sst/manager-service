import { Either, Left, Right } from '../../../@Shared/Either'
import IQueueGateway from '../../../Gateways/Contracts/IQueueGateway'
import { InputPublishDto } from './publish.dto'

export default class PublishUseCase {
    constructor(private readonly queueRepository: IQueueGateway) {}

    async execute(input: InputPublishDto): Promise<Either<Error, void>> {
        try {
            await this.queueRepository.publish(input.topic, input.message)
            return Right(undefined)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }
}
