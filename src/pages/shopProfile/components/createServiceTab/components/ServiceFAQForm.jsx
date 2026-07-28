import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function FAQForm({ service, setService, faq, setFaq }) {
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });

  const handleAddFAQ = (event) => {
    event.preventDefault();

    // Prevent adding empty FAQs
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) return;

    const updatedFAQs = [...(service.faq || []), newFAQ];
    setService({ ...service, faq: updatedFAQs });
    setNewFAQ({ question: "", answer: "" });
    setFaq(updatedFAQs);
  };

  const handleRemoveFAQ = (index) => {
    const updatedFAQs = service.faq.filter((_, i) => i !== index);
    setService({ ...service, faq: updatedFAQs });
    setFaq(updatedFAQs);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewFAQ((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col flex-1 items-center py-4 max-w-full overflow-hidden gap-2">
      <h3 className="text-left w-full px-8">
        Add if you need frecuently asked question for your costumers
      </h3>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Frecuently asked question"
          name="question"
          value={newFAQ.question}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Answer"
          name="answer"
          value={newFAQ.answer}
          onChange={handleChange}
          className="w-full md:w-1/2"
          fullWidth
        />
        <IconButton
          type="submit"
          color="primary"
          sx={{ marginTop: "1rem" }}
          onClick={handleAddFAQ}
        >
          <AddIcon />
        </IconButton>
      </div>

      {service.faq && service.faq.length > 0 && (
        <div className="flex w-full justify-between gap-4 min-w-[300px] px-8">
          <List className="flex flex-col gap-2 p-4 border border-main-100 dark:border-main-900 bg-main-50 dark:bg-main-950 w-full border-t-0 rounded-b">
            {service.faq.map((faq, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveFAQ(index)}>
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`Q: ${faq.question}`}
                  secondary={`A: ${faq.answer}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
