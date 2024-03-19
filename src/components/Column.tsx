import Task from './Task.tsx'
import { useBoardStore } from '../store/BoardStore.ts'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { useModalStore } from '../store/ModalStore.ts'
import { FaEdit } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";

import { useState } from 'react';
import EditModal from './EditModal.tsx';

const Column = (column: {
    id: string,
    index: number,
    title: string,
    taskIds: string[],  // reference to tasks in this column.
}) => {

    const [editColumn, setEditColumn] = useState(false);

    const tasks = useBoardStore((state) => state.tasks);
    const setTaskColumn = useModalStore(state => state.setTaskColumn);

    const openModal = useModalStore((state) => state.openModal)

    const handleAddTask = () => {
        setTaskColumn(column.id);
        openModal();
    }


    return (
        <Draggable draggableId={column.id} index={column.index}>
            {(provided) => (
                <div className='mb-6 md:min-h-60 w-full md:w-1/4 min-w-[300px] md:min-w-[350px]' {...provided.draggableProps} ref={provided.innerRef}>
                    <div {...provided.dragHandleProps} className='h-6 w-7 px-1 py-1 rounded-t-lg bg-white/50 text-gray-800 text-xl'><MdDragIndicator /></div>
                    <Droppable droppableId={column.id} type='task' >
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}
                                className={`min-h-32 px-3 pt-2 pb-3 rounded-tl-none rounded-br-none rounded-xl ${snapshot.isDraggingOver ? 'bg-green-400/60' :
                                    'bg-white/50'} transition-colors shadow-xl `}>
                                <div> {!editColumn ?
                                    <h1 className='flex justify-between items-center mb-2 text-gray-600'>{column.title}
                                        <span onClick={() => setEditColumn(true)} className='text-gray-500/70 text-sm cursor-pointer hover:text-yellow-800'> <FaEdit /></span>
                                    </h1> :
                                    <EditModal columnId={column.id} title={column.title} setEditColumn={setEditColumn} />}
                                </div>

                                {column.taskIds.map((task, index) =>
                                (tasks[task] && <Task
                                    key={task}
                                    index={index}
                                    task={tasks[task]} />)
                                )}

                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                    <div className='flex justify-end'>
                        <button className='bg-gray-300/50 hover:bg-green-800 hover:text-white transition-colors mt-2 shadow-lg text-black/60 px-3 py-1 rounded-lg rounded-tr-none'
                            type='button' onClick={handleAddTask}>Add Task
                        </button>
                    </div>

                </div>
            )
            }

        </Draggable >


    )
}

export default Column