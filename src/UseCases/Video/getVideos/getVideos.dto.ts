export interface InputGetVideosDto {
    email: string
}

export interface OutputGetVideosDto {
    email: string
    videos: [
        {
            id: string
            name: string
            size: number
            contentType: string
            managerService?: { url: string } | undefined
            processService?: { images: { url: string }[] } | undefined
            compressService?: { url: string } | undefined
        }
    ]
}
