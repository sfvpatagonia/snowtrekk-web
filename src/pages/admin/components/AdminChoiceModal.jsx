import BasicModal from "@/components/basicModal/BasicModal";
import HelpIcon from "@mui/icons-material/Help";
const AdminChoiceModal = ({ open, setOpen, message, actionFunction }) => {
  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="bg-main-100 dark:bg-main-900 p-8 rounded-lg flex flex-col items-center justify-center gap-4">
        <HelpIcon color="info" sx={{ fontSize: 150 }}></HelpIcon>
        <h3 className="text-main-0 dark:text-main-1000">{message}</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <button className="button" type="button" onClick={actionFunction}>
            Yes
          </button>
          <button className="button" type="button" onClick={setOpen}>
            No
          </button>
        </div>
      </div>
    </BasicModal>
  );
};

export default AdminChoiceModal;
