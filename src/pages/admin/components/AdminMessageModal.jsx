import { useState } from "react";
import dayjs from "dayjs";
import BasicModal from "@/components/basicModal/BasicModal";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const TYPE_LABELS = {
  footer_contact: "Contact us",
  suggestion_tab: "Suggestion",
};

const AdminMessageModal = ({ open, onClose, message }) => {
  const [copied, setCopied] = useState(false);

  const fullText =
    message?.message ?? message?.suggestion ?? message?.description ?? "";
  const dateValue = message?.updatedAt ?? message?.createdAt ?? null;
  const formattedDate = dateValue
    ? dayjs(dateValue).format("YYYY-MM-DD HH:mm")
    : null;
  const typeLabel = message?.type
    ? TYPE_LABELS[message.type] || message.type
    : null;

  const handleGmailReply = () => {
    if (!message?.email) return;

    const subject = `Re: Snowtrekk - ${typeLabel || "Message"}`;
    const quoted = fullText
      .slice(0, 1500)
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
    const body = `\n\n${quoted}`;

    const url =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(message.email)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyEmail = () => {
    if (!message?.email || !navigator.clipboard) return;

    navigator.clipboard
      .writeText(message.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

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
            <>
              <button className="button" type="button" onClick={handleCopyEmail}>
                {copied ? "Copied" : "Copy email"}
              </button>
              <button className="button" type="button" onClick={handleGmailReply}>
                Reply via Gmail
              </button>
            </>
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
