import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useBoardStore } from "../store/BoardStore";

const EditModal = ({ columnId, title, setEditColumn }: { columnId: string, title: string, setEditColumn: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [editValue, setEditValue] = useState(title);
    const [editColumn, deleteColumn] = useBoardStore((state) => [state.editColumn, state.deleteColumn]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editValue && editValue !== title) editColumn(columnId, editValue);
        setEditColumn(false);
    }

    return (
        <div>
            <form className='flex items-baseline gap-2' onSubmit={handleSubmit}>
                <input className='rounded-md px-2 py-1 mt-1 mb-3 flex-1 outline-yellow-600' type='input' value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder='Enter Column Name' />
                <button disabled={editValue.length === 0} className=' h-5 w-5 text-slate-500 hover:text-green-700 cursor-pointer ' title='Submit' type='submit' ><FaCheck /></button>
                <button onClick={() => setEditColumn(false)} className='text-lg font-bold text-slate-500 hover:text-yellow-800' title='Close Column Edit' type='button'><AiOutlineClose /></button>

                <button onClick={() => deleteColumn(columnId)} className='h-5 w-5 text-lg text-slate-500 hover:text-red-800' title='Delete Column' type='button'><MdOutlineDelete /></button>
            </form>
        </div>
    )
}

export default EditModal