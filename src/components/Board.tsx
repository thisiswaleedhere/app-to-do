import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { useBoardStore } from '../store/BoardStore.ts'
import { updateColumnDB } from '../../utils/utilsColumn.ts'
import Column from './Column.tsx'
import { useEffect } from 'react'

const Board = () => {

    const [columns, columnOrder, getBoard, setTaskOrder, setColumnOrder] =
        useBoardStore((state) =>
            [state.columns,
            state.columnOrder,
            state.getBoard,
            state.setTaskOrder,
            state.setColumnOrder])

    useEffect(() => {
        getBoard()
    }, [getBoard])

    const onDragEndFunction = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return; // If there is no drop destination, the card was not  
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === 'column') {
            const newColumnOrder = Array.from(columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);
            setColumnOrder(newColumnOrder);
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            // const column = columns[source.droppableId];
            const newTasks = Array.from(start.taskIds);
            newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, draggableId);
            const newColumn = { ...start, taskIds: newTasks };
            setTaskOrder({ ...columns, [source.droppableId]: newColumn })  //local update
            updateColumnDB(newColumn) //database update
            return;
        }

        //Moving a task from one column to another
        const startTasks = Array.from(start.taskIds);
        startTasks.splice(source.index, 1);
        const newStartColumn = { ...start, taskIds: startTasks };

        const finishTasks = Array.from(finish.taskIds);
        finishTasks.splice(destination.index, 0, draggableId);
        const newFinishColumn = { ...finish, taskIds: finishTasks };
        //local update
        setTaskOrder({
            ...columns,
            [source.droppableId]: newStartColumn,
            [destination.droppableId]: newFinishColumn
        });
        //db update
        updateColumnDB(newStartColumn)
        updateColumnDB(newFinishColumn)

    }

    return (
        <div className=''>
            <DragDropContext onDragEnd={onDragEndFunction}>
                <Droppable droppableId='allColumns' direction='horizontal' type='column' >
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='p-4 flex gap-4 overflow-y-auto '>
                            {columnOrder.map((each, index) =>
                                <Column
                                    key={each}
                                    index={index}
                                    id={columns[each].id}
                                    title={columns[each].title}
                                    taskIds={columns[each].taskIds} />)}

                            {provided.placeholder}
                        </div>
                    )}

                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default Board