import { databases, ID } from '../appwrite.ts';

const deleteTaskDB = async (id: string) => {
    try {
        await databases.deleteDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_TASKS_COLLECTION_ID!,
            id);
    } catch (error) {
        console.log(error)
    }
}

const editTaskDB = async (props: {
    id: string,
    title: string,
    description?: string,
    dueDate?: string,
    image?: string,
}) => {
    try {
        const updatedFields = { title: props.title, description: props.description, dueDate: props.dueDate, image: props.image }
        await databases.updateDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_TASKS_COLLECTION_ID!,
            props.id, updatedFields)
    } catch (error) {
        console.log(error)
    }
}

const addTaskDB = async (props: {
    title: string,
    description?: string,
    dueDate?: string,
    image?: string,
}) => {
    try {
        const newData = { title: props.title, description: props.description, dueDate: props.dueDate, image: props.image }
        const { $id } = await databases.createDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_TASKS_COLLECTION_ID!,
            ID.unique(), newData);
        return $id;
    } catch (error) {
        console.log(error)
    }
}

export { deleteTaskDB, editTaskDB, addTaskDB }