export interface InputCheckVideoHashDto {
    email: string
    hash: string
}

export interface OutputCheckVideoHashDto {
    exists: boolean
}
