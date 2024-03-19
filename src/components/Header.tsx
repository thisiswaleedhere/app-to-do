import { FaRegHandPeace } from "react-icons/fa6";
import { MdOutlineAddComment } from "react-icons/md";
import { useBoardStore } from "../store/BoardStore.ts";
import { useEffect, useState } from "react";

const Header = () => {

    const [search, setSearch] = useState("");
    const [addColumn, columnOrder, searchBoard] = useBoardStore((state) => [state.addColumn, state.columnOrder, state.searchBoard]);

    useEffect(() => {
        searchBoard(search);
        //debouncing search that limits searching  to every 250ms
        // const timerId = setTimeout(() => {
        //     searchBoard(search)
        //     console.log(search);
        // }, 250);

        // return () => clearTimeout(timerId);
    }, [search, searchBoard])

    return (
        <header className="flex flex-col gap-4 md:flex-row items-center border-b-[1px] border-gray-400/30 py-3 sm:py-4 px-3 sm:px-8">
            <div className="text-3xl flex items-center text-white font-bold"><FaRegHandPeace />-do</div>
            <div className="w-full flex-1 flex md:justify-end space-x-4 ">
                <form className="w-full flex justify-end">
                    <input className=" w-full md:w-96 px-4 py-1 bg-white/80 shadow-xl text-sm rounded-xl"
                        type="text" placeholder="Search ..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type="submit" hidden >Search</button>
                </form>
                {columnOrder.length < 5 &&
                    <span className=' '>
                        <button className="px-3 py-1 flex items-center gap-2 transition-colors shadow-xl bg-white/20 text-gray-800/80 hover:bg-green-800 hover:text-white rounded-xl "
                            type='button' onClick={addColumn} >
                            <MdOutlineAddComment />Add&nbsp;Column&nbsp;[{columnOrder.length + 1}/5]
                        </button>
                    </span>}
            </div>
        </header>
    )
}

export default Header