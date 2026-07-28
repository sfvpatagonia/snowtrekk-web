import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import { Skeleton } from "@mui/material";
import AddActivityModal from "./components/AddActivityModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import admin from "@/services/admin";
import AdminTable from "../adminTable/AdminTable";
import AdminChoiceModal from "../AdminChoiceModal";
import { useSelector } from "react-redux";

const ActivityTab = ({ darkMode, active }) => {
  dayjs.extend(relativeTime);

  const gridRef = useRef();
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 36);
  const [activities, setActivities] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [choiceModal, setChoiceModal] = useState(null);
  const user = useSelector((state) => state.user);

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    {
      field: "name",
    },
    {
      field: "description",
    },
    {
      field: "Images",
    },
    {
      field: "isVisible",
    },
    {
      field: "featured",
    },
    {
      field: "updatedAt",
    },
  ];

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  useEffect(() => {
    if (active && shouldFetch) {
      setLoading(true);
      admin
        .getActivities()
        .then((data) => {
          if (data.ok === false) {
            return setError(data.message);
          }
          setActivities(data.body.activities);
          setShouldFetch(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        })
        .finally(() => setLoading(false));
    }
  }, [shouldFetch]);

  const handleVisibility = (id) => {
    const index = destinations.findIndex((area) => area.id === id);
    changeVisibility({ id, field: "isVisible", type: "destination" }).then(
      (data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setMessage(data.message);
        destinations[index].isVisible = !destinations[index].isVisible;
        setDestinations([...destinations]);
      },
    );
  };

  const handleEdit = (id) => {
    const index = activities.findIndex((destination) => destination.id === id);
    setEditData(activities[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  const refreshData = () => {
    setShouldFetch(true);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add Activity
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={activities}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            //filter={filterValue !== "" && filter}
            columnsVisibility={{ isVisible: false }}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleVisibility={handleVisibility}
          />
        )}
      </Box>
      {addModal && (
        <AddActivityModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          editData={editData}
          setEditData={setEditData}
          setActivities={setActivities}
        />
      )}

      <AdminConfirmationModal
        open={message !== ""}
        setOpen={() => setMessage("")}
        message={message}
      />

      <AdminErrorModal
        open={error !== null}
        setOpen={() => setError(null)}
        error={error}
      />
      <AdminChoiceModal
        open={choiceModal !== null}
        setOpen={() => setChoiceModal(null)}
        message={"Are you sure you want to delete this Activity?"}
        actionFunction={() =>
          admin
            .deleteLocation({ id: choiceModal, type: "activities" }, user.token)
            .then((data) => {
              if (data.ok) {
                setMessage(data.message);
                setActivities(
                  activities.filter((activity) => activity.id !== choiceModal),
                );
                setShouldFetch(true);
              } else {
                setError(data.message);
              }
              setChoiceModal(null);
            })
        }
      />
      {/* <BasicModal open={openEditModal} setOpen={setOpenEditModal}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 px-8 w-full bg-main-100 dark:bg-main-900 p-8 rounded-lg"
        >
          <h3 className="text-main-0 dark:text-main-1000 text-lg font-bold">
            {editData.title}
          </h3>
          {editData.title === "Description" ? (
            <TextField
              label={editData.title}
              name={editData.field}
              value={editData.value}
              onChange={handleChange}
              rows={8}
              multiline
            />
          ) : (
            <TextField
              label={editData.title}
              name={editData.field}
              value={editData.value}
              onChange={handleChange}
            />
          )}
          <button className="button" type="submit">
            Edit
          </button>
        </form>
      </BasicModal> */}
    </div>
  );
};

export default ActivityTab;
