import { Modal, Typography, TextField } from "@mui/material";
import { useState } from "react";
import contactAdmin from "@/services/contactAdmin"; // Ajusta el path si es necesario
import { useSelector } from "react-redux";

const ContactSupportModal = ({ open, onClose }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(null);
  const user = useSelector((state) => state.user);

  const handleSend = async () => {
    setSending(true);
    const res = await contactAdmin.contactAdmin(
      {
        subject,
        message,
        senderName: `${user.name} ${user.lastName}`,
        senderEmail: user.email,
      },
      user.token
    );
    setSending(false);
    setSuccess(res.ok);
    if (res.ok) {
      setFeedback("Mensaje enviado correctamente.");
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setFeedback("");
        onClose();
      }, 1500);
    } else {
      setFeedback(res.message || "Error al enviar el mensaje.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-100 dark:bg-main-900 p-4 rounded text-main-0 dark:text-main-1000">
        <Typography variant="h6" mb={2}>
          Contact Support
        </Typography>
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        {feedback && (
          <Typography color={success ? "success.main" : "error.main"} mt={1}>
            {feedback}
          </Typography>
        )}
        <div className="flex justify-end gap-2 py-4">
          <button onClick={onClose} className="button">
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="button"
            disabled={!subject || !message || sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactSupportModal;
