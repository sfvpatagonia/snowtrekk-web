import { Modal } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import userServices from "@/services/user";

export default function ImageModal({ open, handleClose, image }) {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = useSelector((state) => state.user);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const otherReader = new FileReader();
        otherReader.onloadend = () => setPreview({ url: otherReader.result });
        otherReader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
    });

  const handleSave = () => {
    if (!preview) {
      return setError("Please select an image");
    }

    setLoading(true);

    setError(null);

    userServices
      .changeUserImage(user.id, acceptedFiles[0], user.token)
      .then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setSuccess(data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (success) {
    return (
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          window.location.reload();
        }}
      >
        <div className="absolute flex flex-col items-center justify-between shadow-lg w-[95%] h-auto bg-main-100 dark:bg-main-900 max-w-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 gap-4 overflow-auto">
          <p className="text-green-600">{success}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute flex flex-col items-center justify-between shadow-lg w-[95%] h-auto bg-main-100 dark:bg-main-900 max-w-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 gap-4 overflow-auto">
        {error && <p className="text-red-600">{error}</p>}

        {preview || image ? (
          <div {...getRootProps()} className="flex flex-col flex-1">
            <input {...getInputProps()} />
            <img
              src={preview?.url || image}
              alt="Preview"
              className="max-w-full object-contain cursor-pointer overflow-hidden"
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full p-2 aspect-square border-2 rounded border-dashed max-w-[300px] bg-main-200"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center cursor-pointer p-2 flex-1">
                <p>Drop the files here ...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center cursor-pointer p-2 flex-1">
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            )}
          </div>
        )}
        <button className={`button `} onClick={handleSave} disabled={loading}>
          Save
        </button>
      </div>
    </Modal>
  );
}
