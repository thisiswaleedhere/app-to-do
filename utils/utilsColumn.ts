import { databases, ID } from '../appwrite.ts';



const updateColumnOrderDB = async (props: string[]) => {
    try {
        const updatedFields = { cOrder: props }
        await databases.updateDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_ORDER_COLLECTION_ID!,
            process.env.REACT_APP_ORDER_DOCUMENT_ID!, updatedFields)
    } catch (error) {
        console.log(error)
    }
}

const updateColumnDB = async (props:
    {
        id: string,
        title: string,
        taskIds: string[],
    }) => {
    try {
        const updatedFields = { title: props.title, taskIds: props.taskIds }
        await databases.updateDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_COLUMNS_COLLECTION_ID!,
            props.id, updatedFields)

    } catch (error) {
        console.log(error)
    }
}

const addColumnDB = async (props:
    {
        title: string,
        taskIds: string[],
    }) => {
    try {
        const newData = { title: props.title, taskIds: props.taskIds }
        const { $id } = await databases.createDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_COLUMNS_COLLECTION_ID!,
            ID.unique(), newData);
        return $id;
    } catch (error) {
        console.log(error);
    }
}

const deleteColumnDB = async (id: string) => {
    try {
        await databases.deleteDocument(process.env.REACT_APP_DATABASE_ID!, process.env.REACT_APP_COLUMNS_COLLECTION_ID!,
            id);
    } catch (error) {
        console.log(error)
    }
}

export { updateColumnOrderDB, updateColumnDB, addColumnDB, deleteColumnDB }

