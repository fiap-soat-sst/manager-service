import { describe, it, expect, vi } from 'vitest'
import PublishUseCase from '../../../src/UseCases/Queue/publish/publish.usecase'
import IQueueGateway from '../../../src/Gateways/Contracts/IQueueGateway'
import { InputPublishDto } from '../../../src/UseCases/Queue/publish/publish.dto'
import { Left, Right } from '../../../src/@Shared/Either'

describe('PublishUseCase', () => {
    it('should publish a message successfully', async () => {
        const queueGateway: IQueueGateway = {
            publish: vi.fn().mockResolvedValue(undefined),
        }
        const publishUseCase = new PublishUseCase(queueGateway)
        const input: InputPublishDto = {
            topic: 'test-topic',
            message: 'test-message',
        }

        const result = await publishUseCase.execute(input)

        expect(queueGateway.publish).toHaveBeenCalledWith(
            input.topic,
            input.message
        )
        expect(result).toEqual(Right(undefined))
    })

    it('should return an error when publishing fails', async () => {
        const error = new Error('Publish failed')
        const queueGateway: IQueueGateway = {
            publish: vi.fn().mockRejectedValue(error),
        }
        const publishUseCase = new PublishUseCase(queueGateway)
        const input: InputPublishDto = {
            topic: 'test-topic',
            message: 'test-message',
        }

        const result = await publishUseCase.execute(input)

        expect(queueGateway.publish).toHaveBeenCalledWith(
            input.topic,
            input.message
        )
        expect(result).toEqual(Left(error))
    })
})
