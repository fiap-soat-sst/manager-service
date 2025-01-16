import { Request } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
        file?: {
            buffer: Buffer
            originalname: string
            size: number
            mimetype: string
        }
        email?: string
    }
}
