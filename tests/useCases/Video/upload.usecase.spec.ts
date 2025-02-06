import { describe, it, expect, vi } from 'vitest'
import UploadUseCase from '../../../src/UseCases/Video/upload/upload.usecase'
import IVideoStorageGateway from '../../../src/Gateways/Contracts/IVideoStorageGateway'
import { InputUploadDto } from '../../../src/UseCases/Video/upload/upload.dto'
import { Left, Right } from '../../../src/@Shared/Either'

// FILE: src/UseCases/Video/upload/upload.usecase.test.ts

describe('UploadUseCase', () => {
    const mockVideoStorage: IVideoStorageGateway = {
        upload: vi.fn(),
    }

    const uploadUseCase = new UploadUseCase(mockVideoStorage)

    it('should generate the correct key for the video', async () => {
        const input: InputUploadDto = {
            video: {
                id: '123',
                name: 'test-video',
                contentType: 'video/mp4',
                size: 1024,
                hash: 'abc123',
            },
            file: Buffer.from('test'),
        }

        vi.mocked(mockVideoStorage.upload).mockResolvedValue(
            Right('http://example.com/video')
        )

        await uploadUseCase.execute(input)

        const expectedKey = '123-test-video'
        expect(mockVideoStorage.upload).toHaveBeenCalledWith(
            input.file,
            expectedKey,
            input.video.contentType
        )
    })

    it('should return an error if upload fails', async () => {
        const input: InputUploadDto = {
            video: {
                id: '123',
                name: 'test-video',
                contentType: 'video/mp4',
                size: 1024,
                hash: 'abc123',
            },
            file: Buffer.from('test'),
        }

        vi.mocked(mockVideoStorage.upload).mockResolvedValue(
            Left(new Error('Upload failed'))
        )

        const result = await uploadUseCase.execute(input)

        if (Left(result)) {
            expect((result.value as Error).message).toBe(
                'Error to upload video'
            )
        }
    })
})
