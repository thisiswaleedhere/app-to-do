import { databases } from '../appwrite.ts';

interface Columns {
    [id: string]: {
        id: string,
        title: string,
        taskIds: string[],
    },
}

interface Tasks {
    [id: string]: {
        id: string,
        title: string,
        description?: string,
        dueDate?: string,
        image?: string,
    }
}


export const getDataFromDB = async () => {

    try {
        const tasksData = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID!, // Database ID
            process.env.REACT_APP_TASKS_COLLECTION_ID! // Collection ID
        )

        const awtasks = tasksData.documents.reduce((acc: Tasks, curr) => {
            const id: string = curr.$id;
            const { $id, title, description, dueDate, image } = curr;
            acc[id] = { id: $id, title, description, dueDate, image }
            return acc;
        }, {})


        const columnsData = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID!, // Database ID
            process.env.REACT_APP_COLUMNS_COLLECTION_ID!, // Collection ID
        )

        const awcolumns = columnsData.documents.reduce((acc: Columns, curr) => {
            const id: string = curr.$id;
            const { $id, title, taskIds } = curr;
            acc[id] = { id: $id, title, taskIds }
            return acc;
        }, {})


        const orderData = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID!, // Database ID
            process.env.REACT_APP_ORDER_COLLECTION_ID!, // Collection ID
        )
        const aworderData = orderData.documents[0].cOrder;

        return {
            tasks: awtasks,
            columns: awcolumns,
            columnOrder: aworderData
        }


    } catch (error) {
        console.log(error)
    }




}