const apiUrl = import.meta.env.VITE_API_URL;

// export const getQuestions = async (id, token) => {
//   const response = await fetch(`${apiUrl}/shop/${id}/questions`);
//   const data = await response.json();
//   return data;
// };

export const newQuestion = async (id, question, token) => {
  const response = await fetch(`${apiUrl}/admin/service/${id}/questions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(question),
  });
  const data = await response.json();
  return data;
};

export const newAnswer = async (id, questionId, answer, token) => {
  const response = await fetch(
    `${apiUrl}/admin/service/${id}/questions/${questionId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(answer),
    },
  );
  const data = await response.json();
  return data;
};
