import React, { useState,useEffect } from "react";
import { useController } from "react-hook-form";
import QuizList from "./quiz-list";
import { BiTrash, BiPlus } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { BtnBlue } from "@/ui/btn";
import Modal from "@/ui/modal";
import { FaEdit } from "react-icons/fa";
import { useRemoveMutation ,useGetItemByIdQuery} from "@/redux/api/quiz-api";
import toast from 'react-hot-toast';
import ConfirmDelete from '../../shared/confirm-delete';
import { useRouter } from "next/router";


const Quizes = ({ control }) => {
  const router = useRouter();
  const { query } = router;
  const quizId = query.quiz; // Get quiz ID from URL parameters

  const [remove, setRemove] = useState({ id: "", modal: false });
  const [modal, setModal] = useState(false);

  // React Hook Form Controller
  const { field } = useController({
    name: "quizes",
    defaultValue: [],
    control,
    rules: { required: "Quizzes are required" },
  });

  // Fetch quiz by ID if provided in URL
  const { data: fetchedQuiz, isLoading, error } = useGetItemByIdQuery(quizId, {
    skip: !quizId, // Skip fetching if no quiz ID is provided
  });

  useEffect(() => {
    if (fetchedQuiz && !field.value.some((quiz) => quiz._id === fetchedQuiz._id)) {
      // Add the fetched quiz to the list if it doesn't already exist
      field.onChange([...field.value, fetchedQuiz.data]);
    }
  }, [fetchedQuiz]);

  const removeQuiz = (id) => {
    const updatedList = field.value.filter((quiz) => quiz._id !== id);
    field.onChange(updatedList);
  };

  const toggleRemoveModal = (id) => {
    setRemove((prev) => ({
      modal: !prev.modal,
      id,
    }));
  };

  const onDeleteSuccess = () => {
    const id = remove.id;
    toast.success("Quiz deleted successfully");
    removeQuiz(id);
    toggleRemoveModal();
  };

  const onDeleteError = ({ message }) => {
    toast.error(message);
  };

  return (
    <div className="rounded shadow-sm bg-white p-2 mt-4">
      <Modal
        isOpen={remove.modal}
        toggle={toggleRemoveModal}
        className="max-w-xl"
      >
        <ConfirmDelete
          id={remove.id}
          toggleModal={toggleRemoveModal}
          description="Are you sure you want to delete this quiz? This action cannot be undone."
          title="Delete Quiz"
          onSuccess={onDeleteSuccess}
          onError={onDeleteError}
          useRemoveMutation={useRemoveMutation}
        />
      </Modal>
      <Modal title="Add Quiz" isOpen={modal} toggle={() => setModal(false)}>
        <QuizList
          onChange={field.onChange}
          value={field.value}
          setModal={setModal}
        />
      </Modal>
      <h2 className="text-sm font-medium">Quizzes</h2>
      <div className="border p-2 mt-2 rounded min-h-[5rem]">
        {field.value.length ? (
          <div>
            {field.value.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 p-2 rounded mb-3 relative"
              >
                <div>
                  <p className="text-sm">{item.title}</p>
                  <div className="flex">
                    <p className="text-xs">
                      <span>Mark:</span>
                      <span> {item.total_mark}</span>
                    </p>
                    <p className="text-xs ml-2">
                      <span>Type:</span>
                      <span> {item.type}</span>
                    </p>
                  </div>
                </div>
                <div className="absolute flex items-center gap-2 top-3 right-3">
                  <a
                    className="h-6 w-6 rounded text-white p-1 bg-red-400 cursor-pointer"
                    target="_blank"
                    href={`/teacher/quiz/edit/${item._id}`}
                  >
                    <FaEdit />
                  </a>
                  <IoCloseSharp
                    title="Remove Quiz"
                    type="button"
                    className="h-6 w-6 rounded text-white p-1 bg-red-400 cursor-pointer"
                    onClick={() => removeQuiz(item._id)}
                  />
                  <BiTrash
                    title="Delete Quiz"
                    type="button"
                    className="h-6 w-6 rounded text-white p-1 bg-blue-400 cursor-pointer"
                    onClick={() => toggleRemoveModal(item._id)}
                  />
                </div>
              </div>
            ))}
            <div className="bg-gray-100 p-2 rounded mb-3 flex">
              <p className="mr-2 font-medium text-sm">
                <span>Total Quizzes: </span>
                <span>{field.value.length}</span>
              </p>
              <p className="font-medium text-sm">
                <span>Total Marks: </span>
                <span>
                  {field.value.reduce((acc, ele) => acc + ele.total_mark, 0)}
                </span>
              </p>
            </div>
            <BiPlus
              className="h-6 w-6 rounded text-white p-1 bg-sky-400 cursor-pointer"
              title="Add More Quiz"
              onClick={() => setModal(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[5rem]">
            <p className="font-medium text-sm">No quizzes selected</p>
            <BtnBlue
              type="button"
              onClick={() => setModal(true)}
              className="mt-2 p-2 text-sm rounded"
            >
              Add Quiz
            </BtnBlue>
          </div>
        )}
      </div>
    </div>
  );
};


export default Quizes;
