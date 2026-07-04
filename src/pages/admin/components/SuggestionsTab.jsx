import { Box, Skeleton } from "@mui/material";
import AdminChoiceModal from "./AdminChoiceModal";
import AdminConfirmationModal from "./adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "./adminErrorModal/AdminErrorModal";
import AdminTable from "./adminTable/AdminTable";
import { useEffect, useMemo, useState } from "react";
import suggestion from "@/services/suggestions";

const CONTACT_PREFIX = "[footer_contact]";

const normalizeSuggestion = (item) => {
  const rawMessage = item.suggestion || "";
  const isFooterContact = rawMessage.startsWith(CONTACT_PREFIX);

  return {
    ...item,
    type: isFooterContact ? "footer_contact" : "suggestion_tab",
    message: isFooterContact
      ? rawMessage.replace(CONTACT_PREFIX, "").trim()
      : rawMessage,
  };
};

const escapeCsvValue = (value) => {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export default function SuggestionsTab({ darkMode, active }) {
  const [suggestions, setSuggestions] = useState([]);
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const rows = useMemo(
    () => suggestions.map((item) => normalizeSuggestion(item)),
    [suggestions],
  );

  const filteredRows = useMemo(() => {
    if (filterType === "contact") {
      return rows.filter((item) => item.type === "footer_contact");
    }
    if (filterType === "suggestion") {
      return rows.filter((item) => item.type === "suggestion_tab");
    }
    return rows;
  }, [filterType, rows]);

  const columns = [
    {
      field: "type",
    },
    {
      field: "email",
    },
    {
      field: "message",
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
          } else {
            setError(data.message || data.error || "Error loading suggestions");
          }
        })
        .finally(() => setLoading(false));
      setShouldFetch(false);
    }
  }, [shouldFetch, active]);

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  const handleExportCsv = () => {
    const headers = ["type", "email", "message", "updatedAt"];
    const csvRows = [
      headers.join(","),
      ...filteredRows.map((item) =>
        headers.map((header) => escapeCsvValue(item[header])).join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "snowtrekk-suggestions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            className={`button ${filterType === "all" ? "bg-green-700" : ""}`}
            type="button"
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            className={`button ${filterType === "contact" ? "bg-green-700" : ""}`}
            type="button"
            onClick={() => setFilterType("contact")}
          >
            Contact us
          </button>
          <button
            className={`button ${filterType === "suggestion" ? "bg-green-700" : ""}`}
            type="button"
            onClick={() => setFilterType("suggestion")}
          >
            Suggestions
          </button>
        </div>
        <button
          className="button"
          type="button"
          onClick={handleExportCsv}
          disabled={filteredRows.length === 0}
        >
          Export CSV
        </button>
      </div>

      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : filteredRows.length === 0 ? (
          <div className="text-main-0 dark:text-main-1000 py-12 text-2xl">
            No suggestions
          </div>
        ) : (
          <AdminTable
            rows={filteredRows}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            filter={null}
            columnsVisibility={{ isVisible: false }}
            handleDelete={handleDelete}
          />
        )}
      </Box>

      <AdminConfirmationModal
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
              setError(data.message || data.error);
            }
            setChoiceModal(null);
          })
        }
      />
    </div>
  );
}
