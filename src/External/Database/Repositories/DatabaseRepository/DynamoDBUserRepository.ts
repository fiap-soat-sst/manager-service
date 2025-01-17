import { DynamoDBAdapter } from '../../DynamoDbAdapter'
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from '@aws-sdk/lib-dynamodb'
import IUserRepository from '../Contracts/IUserRepository'
import { Either, Left, Right } from '../../../../@Shared/Either'
import User from '../../../../Entities/User'

export default class DynamoDBUserRepository implements IUserRepository {
    private client: DynamoDBDocumentClient

    constructor(adapter: DynamoDBAdapter) {
        this.client = adapter.getClient()
    }

    async getUser(email: string): Promise<Either<Error, User>> {
        const params = {
            TableName: process.env.AWS_TABLE_USERS,
            Key: {
                email,
            },
        }

        try {
            const result = await this.client.send(new GetCommand(params))

            if (!result.Item) {
                return Left<Error>(new Error('User not found'))
            }

            return Right({
                email: result.Item?.email,
                password: result.Item?.password,
                videos: result.Item?.videos,
            })
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }

    async createUser(input: {
        email: string
        password: string
    }): Promise<void> {
        const params = {
            TableName: 'users',
            Key: {
                email: input.email,
            },
        }

        const result = await this.client.send(new GetCommand(params))

        if (result.Item) {
            throw new Error('Email already registered')
        }

        await this.client.send(
            new PutCommand({
                TableName: 'users',
                Item: {
                    email: input.email,
                    password: input.password,
                    videos: [],
                },
            })
        )
    }

    async saveVideoUser(user: User, urlBucket: string): Promise<void> {
        const item = {
            email: user.email,
            password: user.password,
            videos: user.videos.map((video) => ({
                id: video.id,
                name: video.name,
                size: video.size,
                contentType: video.contentType,
                managerService: {
                    url: urlBucket,
                },
            })),
        }

        await this.client.send(
            new PutCommand({
                TableName: 'users',
                Item: item,
            })
        )
    }
}
