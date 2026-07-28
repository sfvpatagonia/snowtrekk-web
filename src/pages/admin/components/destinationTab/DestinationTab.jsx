import { useEffect, useRef, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import AddDestinationModal from "./components/AddDestinationModal";
import Popover from "@mui/material/Popover";
import { Skeleton } from "@mui/material";
import admin from "@/services/admin";
import AdminTable from "../adminTable/AdminTable";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import changeVisibility from "@/services/changeVisibility";
import AdminChoiceModal from "../AdminChoiceModal";
import deleteLocation from "@/services/deleteLocation";
dayjs.extend(relativeTime);

const DestinationTab = ({ darkMode, active, data }) => {
  const [
    destinations,
    setDestinations,
    cities,
    setCities,
    areas,
    setAreas,
    regions,
    setRegions,
  ] = data;
  const gridRef = useRef();
  const popRef = useRef();
  const navigate = useNavigate();
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);
  const [addModal, setAddModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popover, setPopover] = useState(null);
  const [editData, setEditData] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterValue = searchParams.get("value");

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  useEffect(() => {
    if (active && shouldFetch) {
      setLoading(true);
      admin
        .getDestinations()
        .then((data) => {
          setDestinations(data.body.destinations);
          setShouldFetch(false);
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
      }
    );
  };

  const handleEdit = (id) => {
    const index = destinations.findIndex(
      (destination) => destination.id === id
    );
    setEditData(destinations[index]);
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
      field: "Cities",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;
        if (params.row.cityDestination?.length === 0) {
          return <div>---</div>;
        }

        return (
          <>
            <div
              aria-describedby={rowId}
              variant="contained"
              onClick={(e) => {
                setPopover(e.currentTarget);
                setPopoverOpen(rowId);
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  color: darkMode ? "cyan" : "blue",
                  textDecoration: "underline",
                }}
              >
                {params.row.cityDestination?.map((city, index) => {
                  const lastItem =
                    params.row.cityDestination?.length === index + 1;
                  return lastItem ? city.name : city.name + ", ";
                })}
              </div>
            </div>
            <div>
              <Popover
                ref={popRef}
                id={rowId}
                open={popoverOpen === rowId}
                onClose={() => setPopoverOpen(false)}
                anchorEl={popover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col p-4 rounded-lg gap-2 bg-main-100 dark:bg-main-900">
                  {params.row.cityDestination?.map((city, index) => {
                    const lastItem =
                      params.row.cityDestination?.length === index + 1;
                    return (
                      <div
                        style={{
                          cursor: "pointer",
                          color: darkMode ? "cyan" : "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleCityClick(city.name)}
                        key={index}
                      >
                        {city.name}
                        {!lastItem && ","}
                      </div>
                    );
                  })}
                </div>
              </Popover>
            </div>
          </>
        );
      },
    },
    {
      field: "Area",
      custom: true,
      renderCell: (params) => (
        <div
          style={
            params.row.Area && {
              cursor: "pointer",
              color: darkMode ? "cyan" : "blue",
              textDecoration: "underline",
            }
          }
        >
          {params.row.Area ? params.row.Area.name : "---"}
        </div>
      ),
    },
    {
      field: "Region",
      custom: true,
      renderCell: (params) => (
        <div
          style={
            params.row.Region && {
              cursor: "pointer",
              color: darkMode ? "cyan" : "blue",
              textDecoration: "underline",
            }
          }
        >
          {params.row.Region ? params.row.Region.name : "---"}
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
      field: "featured",
    },
    {
      field: "updatedAt",
    },
  ];

  const handleCityClick = useCallback(
    (cityName) => {
      navigate(`/admin?tab=city&value=${cityName}`);
    },
    [navigate]
  );

  const handleAreaClick = useCallback(
    (areaName) => {
      navigate(`/admin?tab=area&value=${areaName}`);
    },
    [navigate]
  );

  const handleRegionClick = useCallback(
    (regionName) => {
      navigate(`/admin?tab=region&value=${regionName}`);
    },
    [navigate]
  );

  const filter = {
    field: "name",
    operator: "equals",
    value: filterValue,
    id: 2,
  };

  const refreshData = () => {
    setShouldFetch(true);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add Destination
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={destinations}
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
        <AddDestinationModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          regions={regions}
          areas={areas}
          cities={cities}
          setDestinations={setDestinations}
          editData={editData}
          setEditData={setEditData}
          setCities={setCities}
          setAreas={setAreas}
          setRegions={setRegions}
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
        message={"Are you sure you want to delete this destination?"}
        actionFunction={() =>
          deleteLocation({ id: choiceModal, type: "destination" }).then(
            (data) => {
              if (data.ok) {
                setMessage(data.message);
                setDestinations(
                  destinations.filter(
                    (destination) => destination.id !== choiceModal
                  )
                );
                setShouldFetch(true);
              } else {
                setError(data.message);
              }
              setChoiceModal(null);
            }
          )
        }
      />
    </div>
  );
};

export default DestinationTab;
