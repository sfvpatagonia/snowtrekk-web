import { Modal } from "@mui/material";
import styles from "./basicModal.module.css";

const BasicModal = ({ children, open, setOpen }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)} >
      <div className={styles.container}>{children}</div>
    </Modal>
  );
};

export default BasicModal;
