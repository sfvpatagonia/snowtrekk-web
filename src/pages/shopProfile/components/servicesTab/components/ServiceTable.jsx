import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Modal, Skeleton, Tooltip } from "@mui/material";
import shopService from "@/services/shop";
import { selectCurrentService } from "@/redux/shopSlice";
import service from "../../../../../services/service";
import { useState } from "react";

export default function ServiceTable({
  services,
  query,
  loading,
  setServices,
}) {
  const shop = useSelector((state) => state.shop);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    message: "",
    id: "",
  });
  const [choiceModal, setChoiceModal] = useState({
    open: false,
    function: () => {},
    message: "",
    id: "",
  });
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = (id) => {
    dispatch(selectCurrentService(id));
    navigate("/my-shop/update-service");
  };

  const handleVisibility = async (id) => {
    setLoadingLocal(true);
    service
      .toggleServiceVisibility(id, user.token)
      .then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setChoiceModal({
          open: false,
          function: () => {},
          message: "",
        });
        setServices((prev) =>
          prev.map((service) =>
            service.id === id
              ? { ...service, visible: !service.visible }
              : service,
          ),
        );
        setConfirmationModal({
          open: true,
          message: data.message,
          id: id,
        });
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      })
      .finally(() => setLoadingLocal(false));
  };

  const handleDelete = (id) => {
    setLoadingLocal(true);
    service
      .deleteService(id, user.token)
      .then((data) => {
        setServices((prev) => prev.filter((service) => service.id !== id));
        setChoiceModal({
          open: false,
          function: () => {},
          message: "",
        });
        setConfirmationModal({
          open: true,
          message: data.message,
        });
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      })
      .finally(() => setLoadingLocal(false));
  };

  const handleSchedule = (id) => {
    dispatch(selectCurrentService(id));
    navigate("/my-shop/add-availability");
  };

  const handleAdvertise = (service) => {
    shopService
      .advertiseService(shop.id, service, user.token)
      .then((data) => {
        setConfirmationModal({
          open: true,
          message: "A Snowtrekk representative will contact you soon.",
        });
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-gray-300 dark:bg-gray-500">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  if (loading)
    return (
      <div className="flex flex-col gap-0.5 w-full">
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
      </div>
    );

  if (!services.length)
    return <div className="p-4 text-center text-gray-500">No services</div>;

  return (
    <div className="w-full">
      {/* 📱 Mobile cards */}
      <div className="grid gap-4 lg:hidden">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-main-50 dark:bg-main-950 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <Link to={`/service/${service.id}`}>
                <p className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline duration-300 ease-in text-left">
                  {highlightMatch(service.name, query)}
                </p>
              </Link>
              <span className="text-main-0 dark:text-main-1000 text-sm font-semibold">
                U$D {service.price}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-main-100 dark:border-main-900">
              <table className="w-full text-sm text-main-0 dark:text-main-1000">
                <tbody>
                  <tr className="border-b border-main-100 dark:border-main-900">
                    <td className="py-1 px-2 font-semibold w-1/2 bg-main-100 dark:bg-main-900">
                      Categories
                    </td>
                    <td className="py-1 px-2 max-w-1/2 text-ellipsis overflow-hidden ">
                      {service.categories.map((c) => c.name).join(", ")}
                    </td>
                  </tr>
                  <tr className="border-b border-main-100 dark:border-main-900">
                    <td className="py-1 px-2 font-semibold bg-main-100 dark:bg-main-900">
                      Duration
                    </td>
                    <td className="py-1 px-2">{service.duration} min</td>
                  </tr>
                  <tr className="border-b border-main-100 dark:border-main-900">
                    <td className="py-1 px-2 font-semibold bg-main-100 dark:bg-main-900">
                      Difficulty
                    </td>
                    <td className="py-1 px-2">{service.difficulty}</td>
                  </tr>
                  <tr className="border-b border-main-100 dark:border-main-900">
                    <td className="py-1 px-2 font-semibold bg-main-100 dark:bg-main-900">
                      Views
                    </td>
                    <td className="py-1 px-2">{service.views || 0}</td>
                  </tr>
                  <tr className="border-b border-main-100 dark:border-main-900">
                    <td className="py-1 px-2 font-semibold bg-main-100 dark:bg-main-900">
                      Sold
                    </td>
                    <td className="py-1 px-2">{service.sold || 0}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-semibold bg-main-100 dark:bg-main-900">
                      Avg Score
                    </td>
                    <td className="py-1 px-2">{service.averageScore || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-300 dark:border-gray-600">
              <Tooltip title="Edit Service">
                <EditIcon
                  onClick={() => handleEdit(service.id)}
                  className="text-green-500 cursor-pointer"
                />
              </Tooltip>

              <Tooltip title="Edit Schedule">
                <EditCalendarIcon
                  onClick={() => handleSchedule(service.id)}
                  className="text-blue-500 cursor-pointer"
                />
              </Tooltip>

              <Tooltip title="Delete Service">
                <DeleteIcon
                  className="text-red-500 cursor-pointer"
                  onClick={() =>
                    setChoiceModal({
                      open: true,
                      id: service.id,
                      message: "Are you sure you want to delete this service?",
                      function: handleDelete,
                    })
                  }
                />
              </Tooltip>

              {service.visible ? (
                <Tooltip title="Visible - click to hide">
                  <VisibilityIcon
                    color="info"
                    className="cursor-pointer"
                    onClick={() =>
                      setChoiceModal({
                        open: true,
                        message:
                          "Are you sure you want to change the visibility of this service?",

                        function: handleVisibility,
                        id: service.id,
                      })
                    }
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Hidden - click to show">
                  <VisibilityOffIcon
                    className="text-gray-400 cursor-pointer"
                    onClick={() =>
                      setChoiceModal({
                        open: true,
                        message:
                          "Are you sure you want to change the visibility of this service?",

                        function: handleVisibility,
                        id: service.id,
                      })
                    }
                  />
                </Tooltip>
              )}

              <Tooltip title="Advertise this service">
                <AutoAwesomeIcon
                  onClick={() => handleAdvertise(service)}
                  className={`cursor-pointer ${
                    service.isAd
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-300"
                  }`}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Desktop table */}
      <div className="hidden lg:block overflow-x-auto relative rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-main-0 dark:text-main-1000">
          <thead className="bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000">
            <tr>
              <th className="px-4 py-2 sticky left-0 bg-main-50 dark:bg-main-950">
                Name
              </th>
              <th className="px-4 py-2">Categories</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Duration (min)</th>
              <th className="px-4 py-2">Difficulty</th>
              <th className="px-4 py-2">Views</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Avg Score</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-t border-gray-200 dark:border-gray-600 hover:bg-main-50 dark:hover:bg-main-950"
              >
                <td className="px-4 py-2 sticky left-0 bg-main-50 dark:bg-main-950 font-semibold dark:hover:bg-main-900 hover:bg-main-100">
                  <Link
                    to={`/service/${service.id}`}
                    className="text-blue-600 dark:text-cyan-400"
                  >
                    {highlightMatch(service.name, query)}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    {service.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/activity/${cat.id}`}
                        className="text-blue-500 dark:text-cyan-400"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">U$D {service.price}</td>
                <td className="px-4 py-2">{service.duration}</td>
                <td className="px-4 py-2">{service.difficulty}</td>
                <td className="px-4 py-2">{service.views || 0}</td>
                <td className="px-4 py-2">{service.sold || 0}</td>
                <td className="px-4 py-2">{service.averageScore || 0}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Tooltip title="Edit Service">
                      <EditIcon
                        onClick={() => handleEdit(service.id)}
                        color="success"
                        className=" cursor-pointer"
                      />
                    </Tooltip>
                    <Tooltip title="Edit Schedule">
                      <EditCalendarIcon
                        onClick={() => handleSchedule(service.id)}
                        className="text-blue-500 cursor-pointer"
                      />
                    </Tooltip>
                    <Tooltip title="Delete Service">
                      <DeleteIcon className="text-red-500 cursor-pointer" />
                    </Tooltip>
                    {service.visible ? (
                      <Tooltip title="Visible - click to hide">
                        <VisibilityIcon
                          color="info"
                          className=" cursor-pointer"
                          onClick={() =>
                            setChoiceModal({
                              open: true,
                              message:
                                "Are you sure you want to change the visibility of this service?",

                              function: handleVisibility,
                              id: service.id,
                            })
                          }
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Hidden - click to show">
                        <VisibilityOffIcon
                          className="text-gray-400 cursor-pointer"
                          onClick={() =>
                            setChoiceModal({
                              open: true,
                              message:
                                "Are you sure you want to change the visibility of this service?",

                              function: handleVisibility,
                              id: service.id,
                            })
                          }
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Advertise this service">
                      <AutoAwesomeIcon
                        onClick={() => handleAdvertise(service)}
                        className={`cursor-pointer ${
                          service.isAd
                            ? "text-yellow-400"
                            : "text-gray-400 hover:text-yellow-300"
                        }`}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={choiceModal.open}
        onClose={() => {
          setChoiceModal({ open: false, message: "", id: "", function: null });
          setError("");
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-main-100 dark:bg-main-900 min-w-[300px] min-h-[100px] rounded">
            <div className="flex flex-col gap-4 p-4 items-center">
              <h3 className="font-bold text-main-0 dark:text-main-1000 p-4">
                {choiceModal.message}
              </h3>
              <p className="text-red-600 dark:text-red-400 text-xl">{error}</p>
              <div className="flex gap-4">
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    choiceModal.function(choiceModal.id);
                  }}
                  disabled={loadingLocal}
                >
                  {loadingLocal ? "Loading..." : "Yes"}
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    setChoiceModal({
                      open: false,
                      message: "",
                      id: "",
                      function: null,
                    })
                  }
                  disabled={loadingLocal}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={confirmationModal.open}
        onClose={() => setConfirmationModal({ open: false, message: "" })}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-main-100 dark:bg-main-900 min-w-[300px] rounded">
            <div className="flex flex-col gap-2 p-4 items-center">
              <h3 className="font-bold text-main-0 dark:text-main-1000 p-4">
                {confirmationModal.message}
              </h3>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
