import { Modal } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import shop from "@/services/shop";
import { useSelector } from "react-redux";

export default function ImageModal({ open, handleClose, image, shopId }) {
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

    shop
      .changeShopImage(shopId, acceptedFiles[0], user.token)
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto bg-main-100 max-w-[800px] dark:bg-main-900 flex flex-col justify-center items-center p-4 gap-8 rounded">
          <p className="text-main-0 dark:text-main-1000">{success}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto bg-main-100 max-w-[800px] dark:bg-main-900 flex flex-col justify-center items-center p-4 gap-8 rounded">
        {error && <p className="text-red-600">{error}</p>}

        {preview || image ? (
          <div {...getRootProps()} className="flex flex-col flex-1">
            <input {...getInputProps()} />
            <img
              src={preview?.url || image}
              alt="Preview"
              className="max-w-full object-contain cursor-pointer overflow-hidden hover:opacity-75"
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex flex-col w-full max-w-[300px] p-2 justify-center items-center border-2 border-dashed border-main-500 dark:border-main-400 rounded cursor-pointer aspect-square bg-main-200"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-1 flex-col justify-center items-center cursor-pointer p-2">
                <p>Drop the files here ...</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center items-center cursor-pointer p-2">
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            )}
          </div>
        )}
        <button className={`button`} onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
