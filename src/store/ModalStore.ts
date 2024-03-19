import { create } from "zustand";

interface IModalStore {
    isModalOpen: boolean,

    taskId: string | null,
    taskTitle: string,
    taskDescription: string,
    taskDeadline: string,
    taskImage: string,

    taskColumn: string,


    setTaskId: (taskId: string) => void,
    setTaskTitle: (taskTitle: string) => void,
    setTaskDescription: (taskDescription: string) => void,
    setTaskDeadline: (taskDeadline: string) => void,
    setTaskImage: (image?: string) => void,

    setTaskColumn: (columnId: string) => void,


    openModal: () => void,
    closeModal: () => void,
}

export const useModalStore = create<IModalStore>()((set) => ({
    isModalOpen: false,
    taskId: null,
    taskTitle: "",
    taskDescription: "",
    taskDeadline: "",
    taskImage: "",
    taskColumn: "",

    setTaskId: (id) => set({ taskId: id }),
    setTaskTitle: (title: string) => { set({ taskTitle: title }) },
    setTaskDescription: (description: string) => { set({ taskDescription: description }) },
    setTaskDeadline: (deadline: string) => { set({ taskDeadline: deadline }) },
    setTaskImage: (file?) => { set({ taskImage: file }) },
    setTaskColumn: columnId => set({ taskColumn: columnId }),

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => {
        set({
            isModalOpen: false,
            taskId: null,
            taskTitle: "",
            taskDescription: "",
            taskDeadline: "",
            taskImage: "",
            taskColumn: ""
        })
    },

}))