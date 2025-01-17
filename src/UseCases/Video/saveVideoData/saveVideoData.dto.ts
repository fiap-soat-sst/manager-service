import Video from '../../../Entities/Video'

export interface InputSaveVideoDataDto {
    email: string
    urlBucket: string
    video: Video
}

export interface OutputSaveVideoDataDto {
    success: boolean
}
