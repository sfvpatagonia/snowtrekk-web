import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Modal } from "@mui/material";

export default function ServiceImageForm({
  images,
  setImages,
  imagesToDelete,
  setImagesToDelete,
}) {
  const [previewUrl, setPreviewUrl] = useState([]);
  const [detailModal, setDetailModal] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const otherReader = new FileReader();
        otherReader.onloadend = () =>
          setPreviewUrl((prev) => [...prev, { url: otherReader.result }]);
        setImages((prev) => {
          return [...prev, file];
        });
        otherReader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleUnselect = (indexToRemove) => {
    setPreviewUrl((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setDetailModal(null);
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  const handleImagesToDelete = (imageId) => {
    setImagesToDelete((prev) => {
      return prev.includes(imageId) ? prev : [...prev, imageId];
    });
    setDetailModal(null);
  };

  return (
    <>
      {images.length > 0 && (
        <div className="flex justify-start items-start gap-2 p-2 w-full overflow-y-auto flex-wrap rounded bg-main-100 dark:bg-main-900 mb-4">
          {images.map((image, index) => {
            if (imagesToDelete.includes(image.id)) {
              return null;
            } else
              return (
                <div
                  className="flex relative h-full border rounded bg-main-50 dark:bg-main-950 border-main-50 dark:border-main-950 p-0.5 max-w-1/4 duration-300 ease-in hover:border-main-600 hover:dark:border-main-400 aspect-square"
                  key={index}
                  onClick={() => setDetailModal(image.url)}
                >
                  <img
                    src={image.url}
                    alt="imagen del servicio"
                    className="h-full aspect-square object-contain cursor-pointer"
                  />
                  <CloseIcon
                    className="absolute top-0 right-0 text-main-0 dark:text-main-1000 p-0.5 duration-300 ease-in hover:text-main-600 cursor-pointer hover:dark:text-main-400"
                    fontSize="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleImagesToDelete(image.id);
                    }}
                  />
                </div>
              );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-start items-start gap-2 p-2 w-full overflow-y-auto flex-wrap rounded bg-main-100 dark:bg-main-900">
        <div
          {...getRootProps()}
          className="bg-main-200 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center justify-center border-2 border-dashed border-main-400 dark:border-main-600 rounded p-4 cursor-pointer aspect-square"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex flex-col items-center flex-1 justify-center p-2 cursor-pointer">
              <p className="text-lg text-main-0">Drop the files here ...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center flex-1 justify-center p-2 cursor-pointer">
              <FileUploadIcon color="primary" fontSize="large" />
              <p className="text-lg text-main-0">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-start items-start gap-2 p-2 flex-1 overflow-y-auto flex-wrap rounded bg-main-100 dark:bg-main-900">
          {previewUrl.length !== 0
            ? previewUrl.map((image, index) => (
                <div
                  className="flex h-[70px] border border-main-50 dark:border-main-950 p-0.5 rounded-sm"
                  key={index}
                >
                  <img
                    key={index}
                    src={image.url}
                    alt="image"
                    onClick={() => setDetailModal(image.url)}
                    className="h-full aspect-square object-contain cursor-pointer"
                  />
                  <CloseIcon
                    className="p-0.5 duration-300 ease-in hover:text-main-600 cursor-pointer hover:dark:text-main-400"
                    fontSize="small"
                    onClick={() => handleUnselect(index)}
                  />
                </div>
              ))
            : "There is no images yet"}
        </div>
        <Modal open={detailModal !== null} onClose={() => setDetailModal(null)}>
          <div className="flex items-center justify-center h-full w-full p-4">
            <img
              src={detailModal}
              alt="Preview"
              className="object-contain max-w-full"
              onClick={() => setDetailModal(null)}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
