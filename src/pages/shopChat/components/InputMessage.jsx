import { TextField } from "@mui/material";
import { useState } from "react";

export default function InputMessage({ onSend }) {
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage(""); // limpia el input
  };

  return (
    <div className="flex w-full p-2 rounded-bl gap-2 bg-main-50 dark:bg-main-950">
      <TextField
        size="small"
        value={newMessage}
        onChange={(e) => handleChange(e)}
        placeholder="Write your message here"
        multiline
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault(); // evita el salto de línea
            handleSend();
          }
        }}
        sx={{
          flex: 1,
        }}
      />
      {/* <button className={`button ${styles.attachButton}`}>
        <AttachFile />
      </button> */}
      <button className={`button`} onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
