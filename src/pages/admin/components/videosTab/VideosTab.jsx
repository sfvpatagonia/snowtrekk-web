import { useState, useEffect } from "react";
import videoService from "@/services/video";
import getDestinations from "@/services/getDestinations";
import { useSelector } from "react-redux";
import {
  Autocomplete,
  Checkbox,
  Modal,
  Skeleton,
  TextField,
} from "@mui/material";
import {
  Close,
  Delete,
  Edit,
  LocationOnRounded,
  Visibility,
} from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const VideosTab = ({ active }) => {
  const user = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState({
    id: "",
    order: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    idDestination: "",
    description: "",
    videoOrder: "",
    destinationOrder: "",
    videoFile: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (active) {
      fetchVideos();
      fetchDestinations();
    }
  }, [active]);

  // ==========================
  // ✅ ORDEN GLOBAL SEGURO
  // ==========================
  const sortVideosByOrder = (videos) => {
    return [...videos].sort((a, b) => {
      if (a.destinationOrder !== b.destinationOrder) {
        return a.destinationOrder - b.destinationOrder;
      }
      return a.videoOrder - b.videoOrder;
    });
  };

  // ==========================
  // ✅ AGRUPAR POR DESTINO
  // ==========================
  const groupByDestination = (videos) => {
    if (videos.length === 0) return {};
    return videos?.reduce((acc, video) => {
      if (!acc[video.idDestination]) acc[video.idDestination] = [];
      acc[video.idDestination].push(video);
      return acc;
    }, {});
  };

  // ==========================
  // ✅ FETCH VIDEOS
  // ==========================
  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const data = await videoService.getAllVideos(user.token);
      if (data.ok) {
        const ordered = sortVideosByOrder(data.videos);
        setVideos(ordered);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const data = await getDestinations();
      if (data.ok) {
        setDestinations(data.body.destinations);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  // ==========================
  // ✅ CRUD
  // ==========================
  const handleCreateVideo = () => {
    setModalType("create");
    setFormData({ idDestination: "", description: "", videoFile: null });
    setErrors({});
    setShowModal(true);
  };

  const handleEditVideo = (video) => {
    setModalType("edit");
    setSelectedVideo(video);
    setFormData({
      idDestination: video.idDestination,
      description: video.description || "",
      videoFile: null,
      videoOrder: video.videoOrder,
      destinationOrder: video.destinationOrder,
    });
    setShowModal(true);
  };

  const handleViewVideo = (video) => {
    setModalType("view");
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("¿Eliminar este video?")) return;
    const data = await videoService.deleteVideo(videoId, user.token);
    if (data.ok) {
      const updated = videos.filter((v) => v.id !== videoId);
      setVideos(sortVideosByOrder(updated));
    }
  };

  // ==========================
  // ✅ FORM
  // ==========================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.idDestination) newErrors.idDestination = "Destino requerido";
    if (modalType === "create" && !formData.videoFile)
      newErrors.videoFile = "Video requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const submitData = new FormData();
    submitData.append("idDestination", formData.idDestination);
    submitData.append("description", formData.description);
    submitData.append("videoOrder", formData.videoOrder);
    submitData.append("destinationOrder", formData.destinationOrder);
    if (formData.videoFile) submitData.append("video", formData.videoFile);

    let data;
    if (modalType === "create") {
      data = await videoService.createVideo(submitData, user.token);
      setVideos(sortVideosByOrder([data.video, ...videos]));
    } else {
      data = await videoService.updateVideo(
        selectedVideo.id,
        submitData,
        user.token,
      );

      const updated = videos.map((video) =>
        video.id === selectedVideo.id ? data.video : video,
      );

      setVideos(sortVideosByOrder(updated));
    }

    setShowModal(false);
    setSubmitting(false);
  };

  // ==========================
  // ✅ AGRUPADO FINAL
  // ==========================
  const groupedVideos = groupByDestination(videos);
  const handleSelectChange = (selectedOption) => {
    console.log("Selected destination:", selectedOption);
    setFormData({
      ...formData,
      idDestination: selectedOption ? selectedOption.target.value : "",
    });

    // Limpiar error del campo
    if (errors.idDestination) {
      setErrors({ ...errors, idDestination: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "videoFile") {
      setFormData({ ...formData, videoFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  if (!active) return null;

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleChangeDestinationOrder = async () => {
    try {
      const data = await videoService.reorderDestinations(
        selectedDestination.id,
        selectedDestination.order,
        user.token,
      );

      if (data.ok) {
        const ordered = sortVideosByOrder(data.videos);
        setVideos(ordered);
        setSelectedDestination({ id: "", order: "" });
        setShowInput(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-6 py-5 text-main-0 dark:text-main-1000">
        <div className="flex justify-between border-b border-main-600 dark:border-main-400 pb-4">
          <h2 className="text-2xl font-bold">Videos Management</h2>
        </div>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 py-5 text-main-0 dark:text-main-1000">
      {/* HEADER */}
      <div className="flex justify-between border-b border-main-600 dark:border-main-400 pb-4">
        <h2 className="text-2xl font-bold">Videos Management</h2>
        <button className="button" onClick={handleCreateVideo}>
          + Create Video
        </button>
      </div>

      {/* ========================= */}
      {/* ✅ VIDEOS AGRUPADOS */}
      {/* ========================= */}
      {Object.keys(groupedVideos).map((destinationId) => {
        const destinationVideos = groupedVideos[destinationId];
        const destinationName =
          destinations.find((d) => d.id === destinationId)?.name ||
          "Unknown Destination " + destinationId;
        const destinationOrder = destinationVideos[0]?.destinationOrder;

        return (
          <div key={destinationId} className="flex flex-col gap-3 ">
            {/* DESTINO HEADER */}
            <div className="flex justify-between items-center bg-main-100 dark:bg-main-900 px-4 py-2 rounded">
              <h3 className="flex gap-2 text-lg font-bold ">
                <LocationOnRounded /> {destinationName}
              </h3>
              <div className="flex gap-2 items-center">
                <p className="text-sm opacity-70">
                  Destination order:{" "}
                  {destinationId !== selectedDestination.id && destinationOrder}
                </p>
                {showInput && destinationId === selectedDestination.id ? (
                  <>
                    <TextField
                      size="small"
                      name="destinationOrder"
                      type="number"
                      value={selectedDestination.order}
                      onChange={(e) =>
                        setSelectedDestination({
                          id: destinationId,
                          order: e.target.value,
                        })
                      }
                      sx={{ width: 75 }}
                    />
                    <button
                      className="button text-xs"
                      onClick={handleChangeDestinationOrder}
                    >
                      Change
                    </button>
                    <button
                      className="button text-sm"
                      onClick={() => {
                        setShowInput(false);
                        setSelectedDestination({ id: "", order: "" });
                      }}
                    >
                      <Close fontSize="inherit" />
                    </button>
                  </>
                ) : (
                  <button
                    className="button text-xs"
                    onClick={() => {
                      setShowInput(true);
                      setSelectedDestination({
                        id: destinationId,
                        order: destinationOrder,
                      });
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* VIDEOS GRID */}
            <div className="grid gap-5 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
              {destinationVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-main-50 dark:bg-main-950 rounded shadow overflow-hidden"
                >
                  <video
                    src={video.url}
                    className="w-full h-48 object-cover"
                    muted
                  />

                  <div className="p-3 text-sm">
                    <p>{video.description || "Sin descripción"}</p>

                    {/* ✅ ORDEN ADMIN */}
                    <p className="opacity-60 text-xs mt-1">
                      Video Order: {video.videoOrder}
                    </p>
                  </div>

                  <div className="flex gap-2 p-3 border-t">
                    <button
                      className="button"
                      onClick={() => handleViewVideo(video)}
                    >
                      <Visibility />
                    </button>
                    <button
                      className="button"
                      onClick={() => handleEditVideo(video)}
                    >
                      <Edit />
                    </button>
                    <button
                      className="button"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Delete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* ========================= */}
      {/* ✅ MODAL */}
      {/* ========================= */}
      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-50 dark:bg-main-950 rounded-lg shadow-lg ">
            <div className="flex justify-between items-center border-b-2 border-main-600 dark:border-main-400 p-4">
              <h3 className="text-main-0 dark:text-main-1000 text-xl font-bold">
                {modalType === "create" && "Create Video"}
                {modalType === "edit" && "Edit Video"}
                {modalType === "view" && "Watch Video"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="bg-transparent hover:bg-black/20 duration-300 ease-in rounded p-1 text-main-0 dark:text-main-1000 hover:text-main-600 cursor-pointer"
              >
                <Close />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-4 text-main-0 dark:text-main-1000 ">
              {modalType === "view" ? (
                <div className="flex flex-col gap-2">
                  <video
                    src={selectedVideo.url}
                    controls
                    className="w-full max-h-[400px] rounded-lg"
                  />
                  <div className="bg-main-100 dark:bg-main-900 rounded-lg p-4 text-left">
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedVideo.description || "No description"}
                    </p>
                    <p>
                      <strong>Destination:</strong>{" "}
                      {selectedVideo.Destination.name}
                    </p>
                    <p>
                      <strong>Order:</strong> {selectedVideo.videoOrder}
                    </p>
                    <p>
                      <strong>Created date:</strong>{" "}
                      {new Date(selectedVideo.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>URL:</strong>{" "}
                      <a
                        href={selectedVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 dark:text-green-500"
                      >
                        Watch on other tab
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2 text-left"
                >
                  <div className="flex flex-col gap-0.5">
                    <Autocomplete
                      id="idDestination"
                      name="idDestination"
                      value={destinations.find(
                        (d) => d.id === formData.idDestination,
                      )}
                      // onChange={() => handleSelectChange()}
                      options={destinations}
                      renderInput={(params) => {
                        params.InputLabelProps.className =
                          "dark:!text-main-1000 !text-main-0 placeholder:text-main-400";
                        return (
                          <TextField
                            {...params}
                            label={`Select Destination`}
                            inputProps={{ ...params.inputProps }}
                          />
                        );
                      }}
                      getOptionLabel={(option) => option?.name || ""}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li
                            key={option.id}
                            {...optionProps}
                            className="text-left"
                          >
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                              value={option.id}
                              onChange={handleSelectChange}
                            />
                            {option.name}
                          </li>
                        );
                      }}
                      placeholder="Select destination"
                      disabled={submitting}
                      multiple={false}
                      noOptionsText="There are no options that match your search."
                      classes={{
                        inputRoot:
                          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
                        labelRoot:
                          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
                        listbox:
                          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
                        option:
                          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000 hover:dark:!bg-main-400 focus:dark:bg-main-400 focus:dark:!text-main-1000",
                      }}
                    />
                    {errors.idDestination && (
                      <span className="text-red-600 text-sm dark:text-red-400">
                        {errors.idDestination}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Video description..."
                      className="bg-main-100 dark:bg-main-900 p-2"
                      rows={3}
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <TextField
                      type="number"
                      id="videoOrder"
                      name="videoOrder"
                      label="Order"
                      disabled={submitting}
                      value={formData.videoOrder}
                      onChange={handleInputChange}
                      className={
                        errors.videoOrder
                          ? "border-red-600 dark:border-red-400"
                          : ""
                      }
                    />
                    {errors.videoOrder && (
                      <span className="text-red-600 text-sm">
                        {errors.videoOrder}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label htmlFor="videoFile">
                      {modalType === "create"
                        ? "Video file *"
                        : "New video file (optional)"}
                    </label>
                    <input
                      type="file"
                      id="videoFile"
                      name="videoFile"
                      disabled={submitting}
                      accept="video/*"
                      onChange={handleInputChange}
                      className={
                        errors.videoFile
                          ? "border-red-600 dark:border-red-400"
                          : ""
                      }
                    />
                    {errors.videoFile && (
                      <span className="text-red-600 text-sm">
                        {errors.videoFile}
                      </span>
                    )}
                    {/* {formData.videoFile && (
                      <p className="bg-green-50 py-2 px-3 rounded text-sm text-green-800 mt-2">
                        📁 {formData.videoFile.name} (
                        {formatFileSize(formData.videoFile.size)})
                      </p>
                    )} */}
                  </div>

                  {modalType === "edit" && selectedVideo && (
                    <div className="p-4 border-2 border-dashed border-slate-400 rounded-lg">
                      <p>
                        <strong>Current video:</strong>
                      </p>
                      <video
                        src={selectedVideo.url}
                        controls
                        className="w-full max-h-[200px] rounded-lg mt-3"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-2 border-t border-slate-400 pt-5">
                    <button
                      type="button"
                      className={` button !bg-red-600`}
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={` button`}
                      disabled={submitting}
                    >
                      {submitting
                        ? "Procesing..."
                        : modalType === "create"
                          ? "Create Video"
                          : "Update Video"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VideosTab;
