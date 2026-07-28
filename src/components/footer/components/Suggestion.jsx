import { TextField } from "@mui/material";
import { useState } from "react";
import newSuggestion from "@/services/newSuggestion";
import BasicModal from "@/components/basicModal/BasicModal";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Suggestion = () => {
  const initialState = {
    email: "",
    suggestion: "",
    date: new Date().toISOString(),
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Email not valid");
    }

    if (formData.suggestion.trim() === "") {
      return setError("Please insert a suggestion");
    }

    newSuggestion(formData).then((data) => {
      if (data.ok) {
        setSuccess("Thank you to help us improve");
      } else {
        setError(data.message);
      }
    });
    setOpen(false);
    setFormData(initialState);
  };

  return (
    <div className={"fixed flex flex-col z-50 bottom-0 right-2.5"}>
      <div
        className="bg-main-600 dark:bg-main-400 py-1.5 px-2 cursor-pointer rounded-t-md"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-sm text-main-1000">
          We are working to improve, leave us a suggestion
        </h2>
      </div>
      <form
        className={`bg-main-50 dark:bg-main-950 py-5 px-6 border border-main-600 dark:border-main-400 border-b-0 gap-2.5 ${
          open ? "flex flex-col" : "hidden"
        }`}
      >
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <BasicModal open={success || false} setOpen={() => setSuccess(null)}>
          <FavoriteIcon color="primary" sx={{ fontSize: 150 }} />
          <p className="text-2xl font-bold">{success}</p>
        </BasicModal>
        <TextField
          label="E-mail"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          variant="filled"
          type="email"
          required
          size="small"
          inputProps={{
            className: "!text-main-0 dark:!text-main-1000 ",
          }}
          InputLabelProps={{
            classes: {
              root: "!text-main-900 dark:!text-main-100",
              focused: "!text-main-600 dark:!text-main-400",
            },
          }}
          fullWidth
        />
        <TextField
          label="Suggestion"
          size="small"
          value={formData.suggestion}
          onChange={(e) =>
            setFormData({ ...formData, suggestion: e.target.value })
          }
          multiline
          variant="filled"
          inputProps={{
            className: "!text-main-0 dark:!text-main-1000 ",
          }}
          InputLabelProps={{
            classes: {
              focused: "!text-main-600 dark:!text-main-400",
              root: "!text-main-900 dark:!text-main-100 ",
            },
          }}
          required
          rows={4}
          fullWidth
        />
        <button className="button" onClick={handleSubmit}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Suggestion;
