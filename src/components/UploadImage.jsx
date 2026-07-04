import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Modal } from "@mui/material";

export default function UploadImage({ currentImages, setEditData }) {
  const [detailModal, setDetailModal] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImages || []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const otherReader = new FileReader();
        otherReader.onloadend = () =>
          setPreviewUrl((prev) => [...prev, { url: otherReader.result }]);
        setEditData((prev) => {
          const newImages = [...prev.Images, ...acceptedFiles];
          return { ...prev, Images: newImages };
        });
        otherReader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  const handleUnselect = (url) => {
    setPreviewUrl((prev) => prev.filter((image) => image.url !== url));
    setEditData((prev) => ({
      ...prev,
      Images: prev.Images.filter((image) => image.url !== url),
    }));
    setDetailModal(null);
  };

  return (
    <div className="flex w-full gap-4">
      <div
        {...getRootProps()}
        className="flex flex-1 flex-col items-center justify-center p-2 aspect-square bg-main-200 rounded-lg border-dashed border-2 border-main-0 "
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex flex-col flex-1 items-center justify-center p-2 cursor-pointer">
            <p>Drop the files here ...</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center p-2 cursor-pointer">
            <FileUploadIcon className="text-main-600" fontSize="large" />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </div>
      <div className="flex items-start flex-wrap justify-start gap-2 py-2 flex-2 max-h-54 overflow-y-auto">
        {previewUrl.length !== 0 ? (
          previewUrl.map((image, index) => (
            <div className="flex h-20 relative bg-main-200 rounded" key={index}>
              <img
                key={index}
                src={image.url}
                alt="image"
                onClick={() => setDetailModal(image.url)}
                className="cursor-pointer object-contain aspect-square"
              />
              <CloseIcon
                className="absolute top-0 right-0 cursor-pointer text-red-600 z-10 bg-transparent duration-500 ease-linear hover:text-white"
                fontSize="small"
                onClick={() => handleUnselect(image.url)}
              />
            </div>
          ))
        ) : (
          <p className="text-main-0 dark:text-main-1000">
            There is no images yet
          </p>
        )}
      </div>
      <Modal open={detailModal !== null} onClose={() => setDetailModal(null)}>
        <div className="flex items-center w-full h-full p-8">
          <img
            src={detailModal}
            alt="Preview"
            className="object-contain max-w-full"
            onClick={() => setDetailModal(null)}
          />
        </div>
      </Modal>
    </div>
  );
}
