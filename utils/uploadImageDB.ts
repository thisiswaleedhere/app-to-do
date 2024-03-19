import { storage, ID } from '../appwrite'

const uploadImageDB = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(
        process.env.REACT_APP_STORAGE_BUCKET_ID!,
        ID.unique(),
        file
    )
    return fileUploaded;
}

export { uploadImageDB }