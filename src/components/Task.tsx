import { Draggable } from "@hello-pangea/dnd"
import { FaRegEye } from "react-icons/fa";
import { useModalStore } from "../store/ModalStore.ts";
import { LuTimer } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getImageUrlDB } from '../../utils/getImageUrlDB.ts'

interface ITasks {
    task: {
        id: string,
        title: string,
        description?: string,
        dueDate?: string,
        image?: string,
    },
    index: number
}


const Task = ({ task, index }: ITasks) => {

    const
        [
            openModal,
            setTaskTitle,
            setTaskId,
            setTaskDescription,
            setTaskDeadline,
            setTaskImage
        ] = useModalStore((state) =>
            [
                state.openModal,
                state.setTaskTitle,
                state.setTaskId,
                state.setTaskDescription,
                state.setTaskDeadline,
                state.setTaskImage
            ])

    const handleViewTask = () => {
        openModal();
        setTaskId(task.id);
        setTaskTitle(task.title);
        if (task.description) {
            setTaskDescription(task.description);
        }
        if (task.dueDate) {
            setTaskDeadline(task.dueDate);
        }
        if (task.image) {
            setTaskImage(task.image);
        }
    }


    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        if (task.image) {
            setImagePreview(getImageUrlDB(JSON.parse(task.image)).toString())
        }
    }, [task.image])

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={` ${snapshot.isDragging ? 'bg-white' : 'bg-white/60'} max-h-60 rounded-lg shadow py-1 px-2 mb-2`}>
                    <h1 className="flex justify-between text-lg font-bold text-red-700 flex-1 items-center">
                        {task.title}
                        <span onClick={handleViewTask} className="text-gray-400/70 hover:text-blue-600 cursor-pointer px-1"><FaRegEye /></span>
                    </h1>
                    {task.dueDate && <div className="flex items-center gap-2 py-1 text-gray-500 text-sm">
                        <LuTimer /><p>{new Date(task?.dueDate).toDateString().split(" ").slice(1, 4).join(" ")}</p>
                    </div>}
                    {imagePreview && <div className="my-2 max-h-40 overflow-hidden rounded-lg">
                        <img className=" rounded-lg shadow-md "
                            src={imagePreview} alt="Task Image" />
                    </div>
                    }

                </div>
            )}
        </Draggable>
    )
}

export default Task