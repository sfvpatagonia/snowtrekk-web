import { Box, Skeleton } from "@mui/material";
import AdminChoiceModal from "./AdminChoiceModal";
import AdminConfirmationModal from "./adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "./adminErrorModal/AdminErrorModal";
import AdminTable from "./adminTable/AdminTable";
import { useEffect, useState } from "react";
import getEmails from "../../../services/getEmails";
import deleteEmail from "../../../services/deleteEmail";

export default function EmailTab({ darkMode, active }) {
  const [emails, setEmails] = useState([]);
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    { field: "name" },
    {
      field: "email",
    },
    {
      field: "updatedAt",
    },
  ];
  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);
      getEmails()
        .then((data) => {
          if (data.ok) {
            setEmails(data.emails);
          }
        })
        .finally(() => setLoading(false));
      setShouldFetch(false);
    }
  }, [active]);
  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={emails}
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
        message={"Are you sure you want to delete this email?"}
        actionFunction={() =>
          deleteEmail(choiceModal).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setEmails(emails.filter((email) => email.id !== choiceModal));
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
