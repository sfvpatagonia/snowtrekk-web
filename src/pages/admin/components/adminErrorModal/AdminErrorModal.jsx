import BasicModal from "@/components/basicModal/BasicModal";
import ErrorIcon from "@mui/icons-material/Error";

const AdminErrorModal = ({ open, setOpen, error }) => {
  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-2 bg-main-100 dark:bg-main-900 p-8 items-center rounded-lg">
        <ErrorIcon color="error" sx={{ fontSize: 150 }}></ErrorIcon>
        <h3 className="text-main-0 dark:text-main-1000">{error}</h3>
      </div>
    </BasicModal>
  );
};

export default AdminErrorModal;
