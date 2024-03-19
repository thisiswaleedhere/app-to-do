import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { useModalStore } from "../store/ModalStore.ts"
import { FaImage } from "react-icons/fa";
import { useBoardStore } from "../store/BoardStore.ts";
import { uploadImageDB } from '../../utils/uploadImageDB.ts'
import { getImageUrlDB } from '../../utils/getImageUrlDB.ts'


const Modal = () => {

    const imagePicker = useRef<HTMLInputElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [
        isModalOpen,
        closeModal,

        taskId,
        taskTitle,
        taskDescription,
        taskDeadline,
        taskImage,

        taskColumn,

        setTaskImage,
        setTaskTitle,
        setTaskDescription,
        setTaskDeadline

    ] = useModalStore((state) => [
        state.isModalOpen,
        state.closeModal,

        state.taskId,
        state.taskTitle,
        state.taskDescription,
        state.taskDeadline,
        state.taskImage,

        state.taskColumn,

        state.setTaskImage,
        state.setTaskTitle,
        state.setTaskDescription,
        state.setTaskDeadline
    ])

    const [addTask, editTask, deleteTask] = useBoardStore((state) => [state.addTask, state.editTask, state.deleteTask]);

    const handleAddTask = () => {
        if (taskColumn) {
            addTask({ title: taskTitle, description: taskDescription, dueDate: taskDeadline, image: taskImage }, taskColumn);
        }
        if (taskId) {
            editTask(taskId, { title: taskTitle, description: taskDescription, dueDate: taskDeadline, image: taskImage });
        }
        closeModal();
    }

    const handleDeleteTask = () => {
        if (taskId) {
            deleteTask(taskId);
        }
        closeModal();
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // setImageLoading(true);
        if (!e.target.files![0].type.startsWith("image/")) {
            alert('Please choose an image file');
            // setImageLoading(false);
            return
        }
        const fileUploaded = await uploadImageDB(e.target.files![0]);
        if (fileUploaded) {
            const file = {
                bucketId: fileUploaded.bucketId,
                fileId: fileUploaded.$id
            };
            setTaskImage(JSON.stringify(file));
            // setImageLoading(false);
        }
        // setImagePreview(e.target.files![0])
    }

    useEffect(() => {
        setImagePreview(null);
        if (taskImage) {
            const fetchImage = async () => {
                const url = await getImageUrlDB(JSON.parse(taskImage))
                if (url) {
                    setImagePreview(url.toString());
                }
            }
            fetchImage()
        }
    }, [taskImage])


    return (
        <div>
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => closeModal()}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {taskId ? 'Task' : 'Add a Task'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <label className="text-xs text-gray-600"> Title </label>
                                        <input
                                            type="text"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            placeholder="Enter your task title here..."
                                            className="w-full border border-gray-300 rounded-md outline-none px-4 py-3" />
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-xs text-gray-600"> Description </label>
                                        <input
                                            type="text"
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            placeholder="Enter your task description here..."
                                            className="w-full border border-gray-300 rounded-md outline-none px-4 py-3" />
                                    </div>

                                    <div className="mt-6 flex flex-col">
                                        <label className="text-xs text-gray-600"> Due Date </label>
                                        <input className="w-full border border-gray-300 rounded-md outline-none px-4 py-3"
                                            type="date" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} title="due date selector" />
                                    </div>

                                    <div className="mt-6 flex flex-col">
                                        <label className="text-xs text-gray-600"> Image </label>
                                        {!imagePreview ?
                                            <button className="w-full border border-gray-300 bg-gray-100 text-gray-400 hover:text-blue-600 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={() => imagePicker.current?.click()} type="button" title="Image Upload" >
                                                <FaImage className=" w-12 h-12 mx-auto" />
                                            </button>
                                            : (
                                                <img className="w-full h-44 object-cover filter hover:grayscale transition-all duration-150 cursor-pointer"
                                                    src={imagePreview} alt="" height={200} width={200}
                                                    onClick={() => setImagePreview(null)} />
                                            )}
                                        <input className="w-full border border-gray-300 rounded-md outline-none px-4 py-3"
                                            type="file" ref={imagePicker} hidden
                                            onChange={handleImageUpload} title="Image uploader" />
                                    </div>


                                    <div className="mt-4 flex justify-end space-x-2">
                                        {taskId && <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={handleDeleteTask}
                                        >
                                            Delete Task
                                        </button>}
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={handleAddTask}
                                        >
                                            {taskId ? 'Save' : 'Add Task'}
                                        </button>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Modal