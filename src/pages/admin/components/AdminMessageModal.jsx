import dayjs from "dayjs";
import BasicModal from "@/components/basicModal/BasicModal";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const TYPE_LABELS = {
  footer_contact: "Contact us",
  suggestion_tab: "Suggestion",
};

const AdminMessageModal = ({ open, onClose, message }) => {
  const fullText =
    message?.message ?? message?.suggestion ?? message?.description ?? "";
  const dateValue = message?.updatedAt ?? message?.createdAt ?? null;
  const formattedDate = dateValue
    ? dayjs(dateValue).format("YYYY-MM-DD HH:mm")
    : null;
  const typeLabel = message?.type
    ? TYPE_LABELS[message.type] || message.type
    : null;

  return (
    <BasicModal open={open} setOpen={onClose}>
      <div className="flex flex-col gap-3 bg-main-100 dark:bg-main-900 p-8 rounded-lg max-w-xl w-full">
        <div className="flex items-center gap-2">
          <MailOutlineIcon color="info" />
          <h3 className="text-main-0 dark:text-main-1000 text-lg font-semibold">
            {typeLabel || "Message"}
          </h3>
        </div>

        {message?.name && (
          <p className="text-main-0 dark:text-main-1000">
            <strong>Name:</strong> {message.name}
          </p>
        )}

        {message?.email && (
          <p className="text-main-0 dark:text-main-1000">
            <strong>Email:</strong> {message.email}
          </p>
        )}

        {formattedDate && (
          <p className="text-main-0 dark:text-main-1000">
            <strong>Date:</strong> {formattedDate}
          </p>
        )}

        <div
          className="text-main-0 dark:text-main-1000 bg-main-50 dark:bg-main-950 p-4 rounded-md"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {fullText}
        </div>

        <div className="flex gap-4 justify-end">
          {message?.email && (
            <a className="button" href={`mailto:${message.email}`}>
              Reply
            </a>
          )}
          <button className="button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </BasicModal>
  );
};

export default AdminMessageModal;
