export interface InputVerifyAuthTokenDto {
    token: string
}

export interface OutputVerifyAuthTokenDto {
    isValid: boolean
    payload?: any
    error?: string
}
