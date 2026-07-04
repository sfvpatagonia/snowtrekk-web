import { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button, Modal, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import serviceApi from "../../../services/service";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";

export default function Questions({
  questions,
  idService,
  setService,
  service,
}) {
  const [questionsModal, setQuestionsModal] = useState(false);
  const [newQuestionModal, setNewQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerModal, setAnswerModal] = useState(null);
  const [success, setSuccess] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);
  const [deleteModal, setDeleteModal] = useState("");

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) {
      setError("Please enter a question");
      return;
    }
    setError("");

    const question = { body: newQuestion, userId: user.id, serviceId: 1 };

    serviceApi
      .leaveAQuestion(idService, question, user.token)
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setNewQuestionModal(false);
          setNewQuestion("");
          setSuccess("question");

          setService((s) => ({
            ...s,
            Questions: [data.newQuestion, ...s.Questions],
          }));
        } else {
          setError(data.message);
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      setError("Please enter a answer");
      return;
    }
    setError("");

    const answerScheme = { body: answer, userId: user.id, serviceId: 1 };

    serviceApi
      .leaveAnAnswer(idService, answerModal, answerScheme, user.token)
      .then((data) => {
        if (data.ok) {
          setAnswerModal(null);
          setAnswer("");
          setSuccess("answer");
          setService((s) => ({
            ...s,
            Questions: s.Questions.map((q) =>
              q.id === answerModal ? { ...q, Answer: data.newAnswer } : q,
            ),
          }));
        } else {
          setError(data.message);
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleDeleteQuestion = (id) => {
    serviceApi
      .deleteQuestion(service.id, id, user.token)
      .then((data) => {
        if (data.ok) {
          setService((s) => ({
            ...s,
            Questions: s.Questions.filter((q) => q.id !== id),
          }));
          setDeleteModal("success");
        } else {
          setError(data.message);
          setDeleteModal("error");
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
      <h3 className="text-xl w-full flex-1 text-left border-b-2 border-main-600 dark:border-main-400  ">
        User's Questions
      </h3>
      {questions.length > 0 ? (
        <ul className=" text-main-0 dark:text-main-1000 flex flex-col gap-2">
          {questions.slice(0, 3).map((item, index) => {
            return (
              <li key={index} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className=" text-lg font-bold ">{item.body}</p>
                  {service.Shop.users.some((u) => u.id === user.id) && (
                    <DeleteIcon
                      onClick={() => handleDeleteQuestion(item.id)}
                      className="text-red-600 dark:text-red-400 cursor-pointer hover:text-red-400 dark:hover:text-red-600 duration-200"
                    />
                  )}
                </div>
                {item.Answer ? (
                  <p className="p-2 bg-main-100 dark:bg-main-900 mb-2 rounded">
                    {item.Answer.body}
                  </p>
                ) : !item.Answer &&
                  service.Shop.users.some((u) => u.id === user.id) ? (
                  <p
                    className="underline flex gap-2 bg-main-100 dark:bg-main-900 rounded p-2 cursor-pointer hover:text-main-800 dark:hover:text-main-200 duration-200"
                    onClick={() => setAnswerModal(item.id)}
                  >
                    <AddBoxIcon />
                    leave an answer
                  </p>
                ) : (
                  <p className="p-2 bg-main-100 dark:bg-main-900 mb-2 rounded">
                    No answer yet
                  </p>
                )}
              </li>
            );
          })}
          {questions.length > 3 && (
            <p
              className="underline flex gap-2 bg-main-100 dark:bg-main-900 rounded p-2 cursor-pointer hover:text-main-800 dark:hover:text-main-200 duration-200"
              onClick={() => setQuestionsModal(true)}
            >
              See more questions
            </p>
          )}
        </ul>
      ) : (
        <p>No questions yet</p>
      )}
      {!service.Shop.users.some((u) => u.id === user.id) && (
        <p
          className="underline flex gap-2 bg-main-100 dark:bg-main-900 rounded p-2 cursor-pointer hover:text-main-800 dark:hover:text-main-200 duration-200"
          onClick={() => setNewQuestionModal(true)}
        >
          <AddBoxIcon />
          leave a question
        </p>
      )}
      <Modal open={questionsModal} onClose={() => setQuestionsModal(null)}>
        <div className="absolute max-w-xl flex flex-col gap-4 bg-main-100 dark:bg-main-900 rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-main-0 dark:text-main-1000 max-h-3/4 overflow-auto">
          <h2 className="font-bold text-xl">Questions & Answers</h2>
          <ul className="w-90 flex flex-col gap-2">
            {questions.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-col gap-2 bg-main-50 dark:bg-main-950 w-full p-2 rounded"
                >
                  <div className="flex justify-between">
                    <p className=" text-lg font-bold text-left">{item.body}</p>
                    {service.Shop.users.some((u) => u.id === user.id) && (
                      <DeleteIcon
                        onClick={() => handleDeleteQuestion(item.id)}
                        className="text-red-600 dark:text-red-400 cursor-pointer hover:text-red-400 dark:hover:text-red-600 duration-200"
                      />
                    )}
                  </div>

                  {item.Answer ? (
                    <p className="p-2 bg-main-100 dark:bg-main-900 mb-2 rounded">
                      {item.Answer.body}
                    </p>
                  ) : !item.Answer &&
                    service.Shop.users.some((u) => u.id === user.id) ? (
                    <p
                      className="underline flex gap-2 bg-main-100 dark:bg-main-900 rounded p-2 cursor-pointer hover:text-main-800 dark:hover:text-main-200 duration-200"
                      onClick={() => setAnswerModal(item.id)}
                    >
                      <AddBoxIcon />
                      leave an answer
                    </p>
                  ) : (
                    <p className="p-2 bg-main-100 dark:bg-main-900 mb-2 rounded">
                      No answer yet
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <Modal
        open={newQuestionModal}
        onClose={() => setNewQuestionModal(false)}
        aria-labelledby="modal-new-question-title"
        aria-describedby="modal-new-question-description"
      >
        <div className="absolute max-w-xl flex flex-col gap-4 bg-main-100 dark:bg-main-900 rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-main-0 dark:text-main-1000">
          <h2 className="font-bold text-xl">Leave a question</h2>
          <TextField
            name="body"
            value={newQuestion}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 255) {
                setNewQuestion(value);
              }
            }}
            multiline
            rows={8}
            label="Question"
            className="max-w-full w-80"
            inputProps={{ maxLength: 255 }}
            helperText={`${newQuestion.length || 0}/255`}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button className="button" onClick={handleSubmitQuestion}>
            Send
          </Button>
        </div>
      </Modal>
      <Modal
        open={answerModal !== null}
        onClose={() => setAnswerModal(null)}
        aria-labelledby="modal-new-answer-title"
        aria-describedby="modal-new-answer-description"
      >
        <div className="absolute max-w-xl flex flex-col gap-4 bg-main-100 dark:bg-main-900 rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-main-0 dark:text-main-1000">
          <h2 className="font-bold text-xl">Leave an answer</h2>
          <TextField
            name="body"
            value={answer}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 255) {
                setAnswer(value);
              }
            }}
            multiline
            rows={8}
            label="Answer"
            className="max-w-full w-80"
            inputProps={{ maxLength: 255 }}
            helperText={`${answer.length || 0}/255`}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button className="button" onClick={handleSubmitAnswer}>
            Send
          </Button>
        </div>
      </Modal>
      <Modal
        open={success !== ""}
        onClose={() => {
          setSuccess("");
        }}
      >
        <div className="absolute max-w-xl flex flex-col items-center justify-center gap-4 bg-main-100 dark:bg-main-900 rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-main-0 dark:text-main-1000">
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 150 }}
          ></CheckCircleIcon>
          <h3 className="text-main-0 dark:text-main-1000">
            You succesfully left
            {success === "answer" ? " an answer" : " a question"}
          </h3>
        </div>
      </Modal>
      <Modal
        open={deleteModal !== ""}
        onClose={() => {
          setDeleteModal("");
        }}
      >
        <div className="absolute max-w-xl flex flex-col items-center justify-center gap-4 bg-main-100 dark:bg-main-900 rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-main-0 dark:text-main-1000">
          {deleteModal === "success" ? (
            <>
              <CheckCircleIcon
                color="success"
                sx={{ fontSize: 150 }}
              ></CheckCircleIcon>
              <h3 className="text-main-0 dark:text-main-1000">
                You successfully deleted the question
              </h3>
            </>
          ) : (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 150 }}></ErrorIcon>
              <h3 className="text-main-0 dark:text-main-1000">
                {" "}
                An error has ocurred. Please try again later
              </h3>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
