import { Box, Skeleton } from "@mui/material";
import AdminChoiceModal from "./AdminChoiceModal";
import AdminConfirmationModal from "./adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "./adminErrorModal/AdminErrorModal";
import AdminTable from "./adminTable/AdminTable";
import { useEffect, useState } from "react";
import suggestion from "@/services/suggestions";

export default function SuggestionsTab({ darkMode, active }) {
  const [suggestions, setSuggestions] = useState([]);
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    {
      field: "email",
    },
    {
      field: "suggestion",
    },
    {
      field: "updatedAt",
    },
  ];
  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);
      suggestion
        .getSuggestions()
        .then((data) => {
          if (data.ok) {
            setSuggestions(data.suggestions);
          }
        })
        .finally(() => setLoading(false));
      setShouldFetch(false);
    }
  }, [shouldFetch, active]);
  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : suggestions.length === 0 ? (
          <div className="text-main-0 dark:text-main-1000 py-12 text-2xl">
            No suggestions
          </div>
        ) : (
          <AdminTable
            rows={suggestions}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            filter={null}
            columnsVisibility={{ isVisible: false }}
            handleDelete={handleDelete}
          />
        )}
      </Box>

      <AdminationModal
        open={message !== ""}
        setOpen={() => setMessage("")}
        message={message}
      />

      <AdminErrorModal
        open={error !== null}
        setOpen={() => setError(null)}
        error={error}
      />
      <AdminChoiceModal
        open={choiceModal !== null}
        setOpen={() => setChoiceModal(null)}
        message={"Are you sure you want to delete this suggestion?"}
        actionFunction={() =>
          suggestion.deleteSuggestion(choiceModal).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setSuggestions(
                suggestions.filter(
                  (suggestion) => suggestion.id !== choiceModal,
                ),
              );
              setShouldFetch(true);
            } else {
              setError(data.message);
            }
            setChoiceModal(null);
          })
        }
      />
    </div>
  );
}
