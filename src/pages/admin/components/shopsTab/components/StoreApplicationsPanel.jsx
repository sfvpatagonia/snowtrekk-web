import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import storeApplicationsService from "@/services/storeApplications";

const STATUS_LABEL = {
  pending_verification: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
};

const STATUS_COLOR = {
  pending_verification: "text-yellow-600 dark:text-yellow-400",
  verified: "text-green-600 dark:text-green-400",
  rejected: "text-red-600 dark:text-red-400",
};

const ApplicationCard = ({ application, onVerify, onReject, onRequestInfo }) => (
  <div className="flex flex-col gap-2 bg-main-100 dark:bg-main-900 p-4 rounded-lg shadow w-full">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-bold">{application.businessName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {application.category} · {application.destinationCity}
        </p>
      </div>
      <span className={`text-xs font-semibold uppercase ${STATUS_COLOR[application.status]}`}>
        {STATUS_LABEL[application.status]}
      </span>
    </div>

    {application.logoUrl && (
      <img
        src={application.logoUrl}
        alt={`${application.businessName} logo`}
        className="w-16 h-16 object-contain rounded bg-white"
      />
    )}

    <div className="grid grid-cols-2 gap-2 text-sm">
      <p>
        <span className="font-semibold">Owner:</span> {application.ownerName}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {application.email}
      </p>
      <p>
        <span className="font-semibold">Phone:</span> {application.phone}
      </p>
      <p>
        <span className="font-semibold">Website:</span>{" "}
        {application.website || "---"}
      </p>
      <p>
        <span className="font-semibold">Instagram:</span>{" "}
        {application.instagram || "---"}
      </p>
      <p>
        <span className="font-semibold">Facebook:</span>{" "}
        {application.facebook || "---"}
      </p>
      <p>
        <span className="font-semibold">WhatsApp:</span>{" "}
        {application.whatsapp || "---"}
      </p>
    </div>

    {application.description && (
      <p className="text-sm italic">{application.description}</p>
    )}

    {application.status === "rejected" && application.rejectionReason && (
      <p className="text-sm text-red-600 dark:text-red-400">
        <span className="font-semibold">Reason:</span>{" "}
        {application.rejectionReason}
      </p>
    )}

    {application.status === "pending_verification" && (
      <div className="flex gap-2 mt-2">
        <button className="button" onClick={() => onVerify(application)}>
          Verify
        </button>
        <button
          className="button bg-red-600 hover:bg-red-700"
          onClick={() => onReject(application)}
        >
          Reject
        </button>
        <button className="button" onClick={() => onRequestInfo(application)}>
          Request more info
        </button>
      </div>
    )}
  </div>
);

export default function StoreApplicationsPanel({ setError, setMessage }) {
  const user = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null); // { type: "reject" | "request-info", application }
  const [actionText, setActionText] = useState("");

  const fetchApplications = () => {
    setLoading(true);
    storeApplicationsService.getApplications(user.token).then((data) => {
      if (data.ok) {
        setApplications(data.body.applications);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleVerify = async (application) => {
    const data = await storeApplicationsService.verifyApplication(
      application.id,
      user.token,
    );
    if (data.ok) {
      setMessage("Tienda verificada y email enviado.");
      fetchApplications();
    } else {
      setError(data.message || "Could not verify the application");
    }
  };

  const openActionModal = (type, application) => {
    setActionText("");
    setActionModal({ type, application });
  };

  const submitActionModal = async () => {
    if (!actionModal) return;
    const { type, application } = actionModal;

    const data =
      type === "reject"
        ? await storeApplicationsService.rejectApplication(
            application.id,
            actionText,
            user.token,
          )
        : await storeApplicationsService.requestMoreInfo(
            application.id,
            actionText,
            user.token,
          );

    if (data.ok) {
      setMessage(
        type === "reject" ? "Solicitud rechazada." : "Email enviado.",
      );
      fetchApplications();
    } else {
      setError(data.message || "Something went wrong");
    }
    setActionModal(null);
  };

  if (loading) {
    return <p className="text-main-0 dark:text-main-1000">Loading applications...</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold text-main-0 dark:text-main-1000">
        Store Applications
      </h2>
      {applications.length === 0 ? (
        <p className="text-main-0 dark:text-main-1000">No applications yet.</p>
      ) : (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onVerify={handleVerify}
            onReject={(app) => openActionModal("reject", app)}
            onRequestInfo={(app) => openActionModal("request-info", app)}
          />
        ))
      )}

      <BasicModal open={actionModal !== null} setOpen={() => setActionModal(null)}>
        <div className="flex flex-col gap-3 bg-main-100 dark:bg-main-900 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-main-0 dark:text-main-1000 font-bold">
            {actionModal?.type === "reject"
              ? "Reject application"
              : "Request more info"}
          </h3>
          <TextField
            label={actionModal?.type === "reject" ? "Reason" : "Message"}
            multiline
            rows={3}
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button className="button" onClick={() => setActionModal(null)}>
              Cancel
            </button>
            <button className="button" onClick={submitActionModal}>
              Send
            </button>
          </div>
        </div>
      </BasicModal>
    </div>
  );
}
