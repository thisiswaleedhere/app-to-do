import { storage } from '../appwrite'

const getImageUrlDB = (image: {
    bucketId: string;
    fileId: string;
}) => {
    const url = storage.getFilePreview(image.bucketId, image.fileId)
    return url
}

export { getImageUrlDB }