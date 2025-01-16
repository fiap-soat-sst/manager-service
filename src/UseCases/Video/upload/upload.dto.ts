import Video from '../../../Entities/Video'

export interface InputUploadDto {
    file: Buffer
    video: Video
}

export interface OutputUploadDto {
    url: string
}
