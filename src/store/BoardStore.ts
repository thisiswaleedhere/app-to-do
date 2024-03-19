import { create } from 'zustand'
import { getDataFromDB } from '../../utils/getDataFromDB.ts'
import { deleteColumnDB, updateColumnOrderDB, updateColumnDB, addColumnDB } from '../../utils/utilsColumn.ts'
import { deleteTaskDB, editTaskDB, addTaskDB } from '../../utils/utilsTask.ts'
// Type Tid = {}

interface Tasks {
    [id: string]: {
        id: string,
        title: string,
        description?: string,
        dueDate?: string,
        image?: string,
    }
}

type NewTask = {
    title: string,
    description?: string,
    dueDate?: string,
    image?: string,
}

interface Columns {
    [id: string]: {
        id: string,
        title: string,
        taskIds: string[],
    },
}


interface IBoardStore {
    tasks: Tasks,
    columns: Columns,
    columnOrder: string[],

    prevTasks: Tasks,

    getBoard: () => void,
    searchBoard: (searchTerm: string) => void,

    setTaskOrder: (columns: Columns) => void,
    setColumnOrder: (columnOrder: string[]) => void,

    addTask: (task: NewTask, columnId: string) => void,
    editTask: (id: string, updatedTask: NewTask) => void,
    deleteTask: (id: string) => void,

    addColumn: () => void,
    editColumn: (id: string, data: string) => void,
    deleteColumn: (id: string) => void,

}

export const useBoardStore = create<IBoardStore>()((set) => ({

    //Datasets
    tasks: {},
    columns: {},
    columnOrder: [],

    prevTasks: {},


    //Drag and Drop Handlers

    setTaskOrder: (columns) => {
        set({ columns });
        //DB mutations carried out in the OnDragEnd function
    },
    setColumnOrder: (columnOrder) => {
        set({ columnOrder });
        updateColumnOrderDB(columnOrder)
    },

    //Add Edit and Delete Tasks
    addTask: async (task, columnId) => {
        const newId = await addTaskDB(task)
        if (newId) {
            set(({ tasks, columns }) => {
                const newTasks = { ...tasks };
                newTasks[newId] = { id: newId, ...task };

                const newCols = { ...columns };
                if (!newCols[columnId].taskIds) newCols[columnId].taskIds = [];
                newCols[columnId].taskIds.push(newId);
                updateColumnDB(newCols[columnId]);
                return { tasks: newTasks, columns: newCols };
            })
        } else alert("Error adding task to database");
    },
    editTask: (id, updatedTask) => {
        set(({ tasks }) => {
            const newTasks = { ...tasks };
            newTasks[id] = { ...newTasks[id], ...updatedTask };
            editTaskDB(newTasks[id])
            return { tasks: newTasks };
        })
    },
    deleteTask: (id) => {
        set(({ tasks, columns }) => {
            const newTasks = { ...tasks };
            delete newTasks[id];
            deleteTaskDB(id);

            const newCols = { ...columns };
            for (const colId in newCols) {
                if (newCols[colId].taskIds.includes(id)) {
                    newCols[colId].taskIds = newCols[colId].taskIds.filter((tid) => tid !== id);
                    updateColumnDB(newCols[colId]);
                }
            }
            return { tasks: newTasks, columns: newCols };
        });
    },

    //Add Edit and Delete Columns
    addColumn: async () => {
        const newTitle = 'New Column';
        const newId = await addColumnDB({ title: newTitle, taskIds: [] })
        if (newId) {
            set(({ columns, columnOrder }) => {
                const newCols = { ...columns };
                newCols[newId] = { id: newId, title: newTitle, taskIds: [] };
                const newOrder = Array.from(columnOrder);
                newOrder.push(newId);
                updateColumnOrderDB(newOrder);
                return { columns: newCols, columnOrder: newOrder };
            })
        } else alert("Error adding column to database");
    },

    editColumn: (id, data) => {
        set(({ columns }) => {
            const newColumns = { ...columns };
            newColumns[id].title = data;
            updateColumnDB(newColumns[id]);
            return { columns: newColumns };

        });
    },
    deleteColumn: (id) => {
        set(({ tasks, columns, columnOrder }) => {

            const newTasks = { ...tasks };
            const newCols = { ...columns };

            for (const tskId of newCols[id].taskIds) {
                deleteTaskDB(tskId);
                delete newTasks[tskId];
            }

            delete newCols[id];
            deleteColumnDB(id);

            const newOrders = columnOrder.filter((item) => item !== id);
            updateColumnOrderDB(newOrders);
            return { columns: newCols, columnOrder: newOrders };
        });
    },

    searchBoard: (searchTerm) => {
        set(({ prevTasks }) => {
            return { tasks: prevTasks }
        });
        set(({ tasks, prevTasks }) => {
            if (searchTerm) {
                //filter tasks object each title based on the searchTerm and set as newtasks
                const searchTasks: Tasks = {};
                Object.keys(tasks).forEach((key) => {
                    if ((tasks[key].title).toLowerCase().includes(searchTerm.toLowerCase())) {
                        //then copy that particular key value object from tasks into searchTasks
                        searchTasks[key] = tasks[key];
                    }
                });
                return { tasks: searchTasks }
            }
            else return { tasks: prevTasks }
        })
    },

    getBoard: async () => {
        const response = await getDataFromDB();
        set({
            tasks: response?.tasks,
            prevTasks: response?.tasks,
            columns: response?.columns,
            columnOrder: response?.columnOrder
        })

    }
}))



// tasks:
// {
//     'task-1': { id: 'task-1', title: 'New Task 1', description: 'This is a new task.', dueDate: "2024-03-06", imageUrl: 'https://www.kasandbox.org/programming-images/avatars/primosaur-tree.png' },
//     'task-2': { id: 'task-2', title: 'Complete the Todo Project with responsiveness', dueDate: "" },
//     'task-3': { id: 'task-3', title: 'New Task 3', description: 'This is a new task.', dueDate: "2024-01-26", imageUrl: 'https://www.kasandbox.org/programming-images/avatars/orange-juice-squid.png' },
//     'task-4': { id: 'task-4', title: 'New Task 4', description: 'This is a new task.', dueDate: "2024-10-09", imageUrl: 'https://www.kasandbox.org/programming-images/avatars/mr-pants-purple.png' },
//     'task-5': { id: 'task-5', title: 'New Task 5' }
// },
// columns:
// {
//     'column-A': { id: 'column-A', title: 'New Column', taskIds: ['task-1', 'task-2'] },
//     'column-B': { id: 'column-B', title: 'B Column', taskIds: ['task-3'] },
//     'column-C': { id: 'column-C', title: 'C Column', taskIds: ['task-4', 'task-5'] }
// },
// columnOrder: ['column-A', 'column-B', 'column-C'],