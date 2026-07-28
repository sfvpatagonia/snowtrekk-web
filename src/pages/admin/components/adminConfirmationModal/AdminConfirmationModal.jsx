import BasicModal from "@/components/basicModal/BasicModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AdminConfirmationModal = ({ open, setOpen, message }) => {
  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-2 bg-main-100 dark:bg-main-900 p-8 items-center rounded-lg">
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 150 }}
        ></CheckCircleIcon>
        <h3 className="text-main-0 dark:text-main-1000">{message}</h3>
      </div>
    </BasicModal>
  );
};

export default AdminConfirmationModal;
