import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AddAreaModal from "./components/AddAreaModal";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import admin from "@/services/admin";
import AdminTable from "../adminTable/AdminTable";
import changeVisibility from "@/services/changeVisibility";
import deleteLocation from "@/services/deleteLocation";
import AdminChoiceModal from "../AdminChoiceModal";
import { useNavigate } from "react-router-dom";

const AreaTab = ({ darkMode, active, data }) => {
  const [countries, setCountries, areas, setAreas] = data;
  dayjs.extend(relativeTime);
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 36);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterValue = searchParams.get("value");
  const [addModal, setAddModal] = useState(false);
  const [choiceModal, setChoiceModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    {
      field: "name",
    },
    {
      field: "Country",
      custom: true,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: darkMode ? "cyan" : "blue",
            textDecoration: "underline",
          }}
          onClick={() =>
            navigate(`/admin?tab=country&value=${params.row.country}`)
          }
        >
          {params.row.country}
        </div>
      ),
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
      field: "updatedAt",
    },
  ];

  useEffect(() => {
    if (active && shouldFetch) {
      setLoading(true);
      admin
        .getAreas()
        .then((data) => {
          setAreas(data.body.areas);
          setShouldFetch(false);
        })
        .finally(() => setLoading(false));
    }
  }, [shouldFetch]);

  const handleVisibility = (id) => {
    const index = areas.findIndex((area) => area.id === id);
    changeVisibility({ id, field: "isVisible", type: "area" }).then((data) => {
      if (!data.ok) {
        return setError(data.message);
      }
      setMessage(data.message);
      areas[index].isVisible = !areas[index].isVisible;
      setAreas([...areas]);
    });
  };

  const handleEdit = (id) => {
    const index = areas.findIndex((area) => area.id === id);
    setEditData(areas[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  const refreshData = () => {
    setShouldFetch(true);
  };

  const filter = {
    field: "name",
    operator: "equals",
    value: filterValue,
    id: 2,
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add Area
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((load, index) => <div key={index}>{load}</div>)
        ) : (
          <AdminTable
            rows={areas}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            filter={filterValue !== "" && filter}
            columnsVisibility={{ isVisible: false }}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleVisibility={handleVisibility}
          />
        )}
      </Box>
      {addModal && (
        <AddAreaModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          countries={countries}
          setCountries={setCountries}
          editData={editData}
          setEditData={setEditData}
          setAreas={setAreas}
        />
      )}
      <AdminConfirmationModal
        open={message !== ""}
        setOpen={() => setMessage("")}
        message={message}
      />
      <AdminChoiceModal
        open={choiceModal !== null}
        setOpen={() => setChoiceModal(null)}
        message={"Are you sure you want to delete this area?"}
        actionFunction={() =>
          deleteLocation({ id: choiceModal, type: "area" }).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setAreas(areas.filter((area) => area.id !== choiceModal));
              setShouldFetch(true);
            } else {
              setError(data.message);
            }
            setChoiceModal(null);
          })
        }
      />
      <AdminErrorModal
        open={error !== null}
        setOpen={() => setError(null)}
        error={error}
      />
    </div>
  );
};

export default AreaTab;
