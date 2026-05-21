import  { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import AddCityModal from "./components/AddCityModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import admin from "@/services/admin";
import AdminTable from "../adminTable/AdminTable";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import AdminChoiceModal from "../AdminChoiceModal";
import changeVisibility from "@/services/changeVisibility";
import deleteLocation from "@/services/deleteLocation";

const CityTab = ({ darkMode, active, data }) => {
  const [
    leads,
    setLeads,
    countries,
    setCountries,
    areas,
    setAreas,
    cities,
    setCities,
    destinations,
    setDestinations,
    activities,
    setActivities,
  ] = data;
  dayjs.extend(relativeTime);
  const gridRef = useRef();
  const navigate = useNavigate();
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 35);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterValue = searchParams.get("value");
  const [choiceModal, setChoiceModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const handleAreaClick = useCallback(
    (areaId) => {
      navigate(`/admin?tab=area&value=${areaId}`);
    },
    [navigate]
  );

  const handleCountryClick = useCallback(
    (countryId) => {
      navigate(`/admin?tab=country&value=${countryId}`);
    },
    [navigate]
  );

  const refreshData = () => {
    setShouldFetch(true);
  };

  const filter = {
    field: "name",
    operator: "equals",
    value: filterValue,
    id: 2,
  };

  const handleVisibility = (id) => {
    const index = cities.findIndex((area) => area.id === id);
    changeVisibility({ id, field: "isVisible", type: "city" }).then((data) => {
      if (!data.ok) {
        return setError(data.message);
      }
      setMessage(data.message);
      cities[index].isVisible = !cities[index].isVisible;
      setCities([...cities]);
    });
  };

  const handleEdit = (id) => {
    const index = cities.findIndex((city) => city.id === id);
    setEditData(cities[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  const columns = [
    {
      field: "name",
    },
    {
      field: "area",
      custom: true,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: darkMode ? "cyan" : "blue",
            textDecoration: "underline",
          }}
          onClick={() => handleAreaClick(params.row.area)}
        >
          {params.row.area}
        </div>
      ),
    },
    {
      field: "country",
      custom: true,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: darkMode ? "cyan" : "blue",
            textDecoration: "underline",
          }}
          onClick={() => handleCountryClick(params.row.countryName)}
        >
          {params.row.countryName}
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
      field: "updatedAt",
    },
  ];

  useEffect(() => {
    if (active && shouldFetch) {
      setLoading(true);
      admin
        .getCities()
        .then((data) => {
          setCities(data.body.cities);
          setShouldFetch(false);
        })
        .finally(() => setLoading(false));
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (shouldSubmit && editData !== null) {
      handleSubmit();
      setShouldSubmit(false); // Reset the flag after submit
    }
  }, [shouldSubmit, editData]);

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add City
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={cities}
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
        {addModal && (
          <AddCityModal
            open={addModal}
            setOpen={setAddModal}
            refreshData={refreshData}
            setError={setError}
            setMessage={setMessage}
            setCities={setCities}
            setAreas={setAreas}
            areas={areas}
            setEditData={setEditData}
            editData={editData}
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
          message={"Are you sure you want to delete this city?"}
          actionFunction={() =>
            deleteLocation({ id: choiceModal, type: "city" }).then((data) => {
              if (data.ok) {
                setMessage(data.message);
                setCities(cities.filter((city) => city.id !== choiceModal));
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
      </Box>
    </div>
  );
};

export default CityTab;
