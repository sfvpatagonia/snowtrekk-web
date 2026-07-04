import { useState } from "react";
import { Modal, TextField, Typography } from "@mui/material";
import createEmail from "@/services/createEmail";

const EmailModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleConfirm = async () => {
    if (email) {
      const emailData = { email, name };
      try {
        const response = await createEmail(emailData);

        //if 200
        if (response.name) {
          localStorage.setItem("userEmail", email);
          handleClose(); // Cierra el modal
        } else {
          setError("Error saving email. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Network error. Please try again.");
      }
    } else {
      setError("Please enter an email.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-50 dark:bg-main-950 p-8 rounded-lg shadow-lg w-80">
        <h2
          id="modal-title"
          className="text-main-0 dark:text-main-1000 text-xl"
        >
          Enter your email to receive{" "}
          <span className="font-bold text-green-700">Snowtrekk</span>{" "}
          notifications
        </h2>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          inputProps={{
            className: "!text-main-0 dark:!text-main-1000 ",
          }}
          InputLabelProps={{
            classes: {
              root: "!text-main-900 dark:!text-main-100",
              focused: "!text-main-600 dark:!text-main-400",
            },
          }}
          onChange={handleEmailChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Name (Optional)"
          variant="outlined"
          value={name}
          inputProps={{
            className: "!text-main-0 dark:!text-main-1000 ",
          }}
          InputLabelProps={{
            classes: {
              root: "!text-main-900 dark:!text-main-100",
              focused: "!text-main-600 dark:!text-main-400",
            },
          }}
          onChange={handleNameChange}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <div className="flex w-full justify-center mt-4">
          <button className="button" onClick={handleConfirm} sx={{ mt: 2 }}>
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailModal;
