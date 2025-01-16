export default class Video {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly size: number,
        public readonly contentType: string
    ) {
        if (!name || !contentType || size <= 0) {
            throw new Error('Invalid video properties')
        }
    }
}
