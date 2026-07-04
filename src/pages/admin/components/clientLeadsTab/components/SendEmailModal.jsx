import { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Select,
  MenuItem,
  Chip,
  FormGroup,
} from "@mui/material";
import admin from "@/services/admin";

const SendEmailModal = ({ open, onClose, clients, setConfirm, setError }) => {
  const [selectedClients, setSelectedClients] = useState(clients);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleClientChange = (event) => {
    setSelectedClients(event.target.value);
  };

  const handleSend = () => {
 
    admin
      .sendEmail({
        clients: clients.map((client) => client.email),
        subject,
        message,
      })
      .then((response) => {
        if (response.ok) {
          setConfirm(response.message);
        } else {
          setError(response.message);
        }
        setSelectedClients([]);
        setSubject("");
        setMessage("");
        onClose();
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 !bg-main-50 dark:!bg-main-950 shadow-lg p-12 rounded-lg">
        <div>
          <h3 className="text-2xl text-main-600 dark:text-main-400 font-bold">
            Send Email
          </h3>
          <h4 className="text-main-0 dark:text-main-1000">To clients</h4>
        </div>
        <FormGroup>
          <Select
            multiple
            value={clients.map((client) => client.email)}
            id="clients"
            name="clients"
            placeholder="Clients"
            onChange={handleClientChange}
            fullWidth
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.email}>
                {client.name} ({client.email})
              </MenuItem>
            ))}
          </Select>

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
            margin="normal"
            multiline
            rows={4}
          />
        </FormGroup>

        <div className="flex justify-end gap-2">
          <button className="!bg-red-600 button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            onClick={handleSend}
         
            disabled={!subject || !message}
          >
            Send
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default SendEmailModal;
