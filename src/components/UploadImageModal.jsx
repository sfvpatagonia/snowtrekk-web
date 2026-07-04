import { useCallback, useState } from "react";
import BasicModal from "./basicModal/BasicModal";
import setImages from "@/services/setImages";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const UploadImageModal = ({
  editData,
  setError,
  setMessage,
  open,
  setOpen,
  setShouldFetch,
}) => {
  const [uploading, setUploading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(editData.value);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onloadend = () => {
        const otherReader = new FileReader();
        otherReader.onloadend = () =>
          setPreviewUrl((prev) => [...prev, { url: otherReader.result }]);
        otherReader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append(`image`, file);
    });

    const item = { id: editData.id, type: editData.type };
    const data = await setImages(item, formData);

    if (data.ok) {
      setMessage(data.message);
      setOpen(false);
    } else {
      setError(data.message);
    }

    setUploading(false);
    setShouldFetch(true);
  };

  return (
    <>
      <BasicModal open={open} setOpen={setOpen}>
        <div className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded-lg">
          <div className="flex flex-col gap-4">
            {imagesLoaded.length !== 0 && (
              <div className="flex overflow-x-auto min-w-[600px] max-h-[600px] gap-2">
                {imagesLoaded.map((img) => (
                  <img
                    src={img.url}
                    alt="Preview"
                    className="object-contain w-full max-w-full cursor-pointer"
                    onClick={() => setDetailModal(img)}
                  />
                ))}
              </div>
            )}
            <button className={`button `} onClick={() => setUploadModal(true)}>
              Add Images
            </button>
          </div>
        </div>
      </BasicModal>
      <BasicModal open={detailModal} setOpen={setDetailModal}>
        <div className="relative bg-main-100 dark:bg-main-900 p-4 rounded-lg max-h-[600px] min-w-[600px] flex flex-col gap-2 justify-end">
          <button className={`button`} onClick={() => handleDelete(preview.id)}>
            Delete
          </button>
          <img
            src={detailModal.url}
            alt="Preview"
            className={"object-contain max-w-full"}
          />
        </div>
      </BasicModal>
      <BasicModal open={uploadModal} setOpen={setUploadModal}>
        <div className="relative flex flex-col gap-4 bg-main-100 dark:bg-main-900 px-4 py-12 rounded-lg max-h-[600px] overflow-y-auto min-w-[600px]">
          <h2 className="text-2xl font-bold text-main-600 dark:text-main-400">
            Upload Images
          </h2>
          <form className="flex flex-col-reverse lg:flex-row items-center justify-center">
            {previewUrl.length !== 0 && (
              <div className="flex lg:flex-col w-[600px] p-4 justify-center items-center gap-2 flex-wrap">
                {previewUrl.map((preview) => (
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="object-contain h-auto w-1/3 lg:w-full cursor-pointer hover:opacity-80"
                    onClick={() => setDetailModal(preview)}
                  />
                ))}
              </div>
            )}
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-1 flex-col items-center justify-center p-2 cursor-pointer ">
                  <p>Drop the files here ...</p>
                </div>
              ) : (
                <div className="flex w-1/2 mx-auto lg:flex-1 flex-col rounded-lg items-center justify-center p-2 cursor-pointer aspect-square border-dashed border-2 border-main-0 dark:border-main-1000 bg-main-100 dark:bg-main-900 ">
                  <FileUploadIcon
                    fontSize="large"
                    className="text-main-600 dark:text-main-400"
                  />
                  <p className="text-main-0 dark:text-main-1000 pt-4">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                </div>
              )}
            </div>
          </form>
          <button
            onClick={handleSubmit}
            disabled={
              uploading ||
              editData.value.forEach((value) => previewUrl.includes(value))
            }
            className="button"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </BasicModal>
    </>
  );
};

export default UploadImageModal;
