import { useState } from "react";
import { Checkbox, CircularProgress, TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import newActivity from "@/services/newActivity";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import UploadImage from "@/components/UploadImage";
import setImages from "@/services/setImages";
import { useSelector } from "react-redux";
import activities from "../../../../../services/activities";

const AddActivityModal = ({
  open,
  setOpen,
  setMessage,
  setError,
  refreshData,
  editData,
  setEditData,
  setActivities,
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const initialData = {
    name: "",
    description: "",
    featured: false,
    isVisible: true,
    Images: [],
  };
  const [activity, setActivity] = useState(editData || initialData);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const onSubmit = (e) => {
    e.preventDefault();

    if (activity.name === "") {
      return setError("Complete the activity name field");
    }
    setLoading(true);

    const formData = new FormData();

    activity.Images.forEach((element) => {
      formData.append("image", element);
    });

    if (editData) {
      activities.updateActivity(activity, user.token).then((data) => {
        if (!data.ok) {
          setOpen(false);
          return setError(data.message);
        }
        let images = [];
        setImages({ id: editData.id, type: "activities" }, formData)
          .then((data) => {
            if (!data.ok) {
              setOpen(false);
              return setError(data.message);
            }
          })
          .then(() => {
            setActivities((prevAct) => {
              return prevAct.map((act) => {
                if (act.id === editData.id) {
                  return activity;
                }
                return act;
              });
            });
          })
          .finally(() => {
            setOpen(false);
            setLoading(false);
            setMessage(data.message);
            setEditData([]);
            refreshData();
          });
      });
    } else {
      newActivity(activity)
        .then((data) => {
          if (!data.ok) {
            return setError(data.message);
          }
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => setLoading(false));
      setActivity(initialData);
      setEditData([]);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const onClose = () => {
    setActivity(initialData);
    setEditData(null);
    return setOpen();
  };

  return (
    <BasicModal
      open={open}
      setOpen={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute flex flex-col items-center justify-center px-12 py-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-100 dark:bg-main-900 rounded-lg gap-4">
        <h3 className="text-2xl text-main-0 dark:text-main-1000 font-bold">
          {editData ? "Edit" : "Add"} Activity
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 items-center"
        >
          <TextField
            label="Activity name"
            name="name"
            value={activity.name}
            onChange={handleChange}
            sx={{ width: 600, maxWidth: "100%" }}
          />
          <div className="flex w-full gap-2">
            <div className="flex items-center justify-start border p-2 rounded border-main-1000/20 dark:border-main-0/20 text-main-0 dark:text-main-1000">
              <Checkbox
                checked={activity.featured}
                icon={icon}
                checkedIcon={checkedIcon}
                disabled={loading}
                onChange={() =>
                  setActivity((prev) => ({
                    ...prev,
                    featured: !prev.featured,
                  }))
                }
              />
              is Featured?
            </div>
            <div className="flex items-center justify-start border p-2 rounded border-main-1000/20 dark:border-main-0/20  text-main-0 dark:text-main-1000">
              <Checkbox
                checked={activity.isVisible}
                icon={icon}
                checkedIcon={checkedIcon}
                disabled={loading}
                onChange={() =>
                  setActivity((prev) => ({
                    ...prev,
                    isVisible: !prev.isVisible,
                  }))
                }
              />
              is Visible?
            </div>
          </div>
          <TextField
            label="Activity description"
            name="description"
            value={activity.description}
            onChange={handleChange}
            multiline
            rows={10}
            sx={{ width: 600, maxWidth: "100%" }}
          />
          <UploadImage
            currentImages={editData?.Images || []}
            setEditData={setActivity}
          />
          <button className="button" type="submit" disabled={loading}>
            {loading
              ? "Loading..."
              : editData
                ? "Edit Activity"
                : "Add Activity"}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddActivityModal;
