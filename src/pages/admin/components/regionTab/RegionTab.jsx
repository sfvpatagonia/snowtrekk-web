import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover, Skeleton } from "@mui/material";
import AddRegionModal from "./components/AddRegionModal";
import admin from "@/services/admin";
import AdminTable from "../adminTable/AdminTable";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import AdminChoiceModal from "../AdminChoiceModal";
import changeVisibility from "@/services/changeVisibility";

const RegionTabs = ({ darkMode, active, data }) => {
  const [regions, setRegions, areas, setAreas] = data;
  const popRefArea = useRef();
  const popRefCountry = useRef();
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 36);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterValue = searchParams.get("value");
  const [addModal, setAddModal] = useState(false);
  const [choiceModal, setChoiceModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [popoverAreaOpen, setPopoverAreaOpen] = useState(false);
  const [popoverArea, setPopoverArea] = useState(null);
  const [popoverCountryOpen, setPopoverCountryOpen] = useState(false);
  const [popoverCountry, setPopoverCountry] = useState(null);
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
      field: "Areas",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;
        return (
          <div
            aria-describedby={rowId}
            variant="contained"
            onClick={(e) => {
              setPopoverArea(e.currentTarget);
              setPopoverAreaOpen(rowId);
            }}
          >
            <div
              style={{
                cursor: "pointer",
                color: darkMode ? "cyan" : "blue",
                textDecoration: "underline",
              }}
            >
              {params.row.areas?.map((area, index) => {
                const lastItem = params.row.areas.length === index + 1;
                return lastItem ? area.name : area.name + ", ";
              })}
            </div>
            <div>
              <Popover
                ref={popRefArea}
                id={rowId}
                open={popoverAreaOpen === rowId}
                onClose={() => setPopoverAreaOpen(false)}
                anchorEl={popoverArea}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col p-4 rounded-lg gap-2 bg-main-100 dark:bg-main-900">
                  {params.row.areas?.map((area, index) => {
                    const lastItem = params.row.areas.length === index + 1;

                    return (
                      <div
                        style={{
                          cursor: "pointer",
                          color: darkMode ? "cyan" : "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          handleAreaClick(area.name);
                        }}
                        key={index}
                      >
                        {lastItem ? area.name : area.name + ", "}
                      </div>
                    );
                  })}
                </div>
              </Popover>
            </div>
          </div>
        );
      },
    },
    {
      field: "Countries",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;

        const regionCountries = [
          ...new Map(
            params.row.areas?.flatMap((area) =>
              [area.Country].map((country) => [country.id, country])
            )
          ).values(),
        ];
        return (
          <div
            aria-describedby={rowId}
            variant="contained"
            onClick={(e) => {
              setPopoverCountry(e.currentTarget);
              setPopoverCountryOpen(rowId);
            }}
          >
            <div
              style={{
                cursor: "pointer",
                color: darkMode ? "cyan" : "blue",
                textDecoration: "underline",
              }}
            >
              {regionCountries.length === 1
                ? regionCountries[0].name
                : regionCountries.map((country, index) => {
                    const lastItem = regionCountries.length === index + 1;
                    return lastItem ? country.name : country.name + ", ";
                  })}
            </div>
            <div>
              <Popover
                ref={popRefCountry}
                id={rowId}
                open={popoverCountryOpen === rowId}
                onClose={() => setPopoverCountryOpen(false)}
                anchorEl={popoverCountry}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col p-4 rounded-lg gap-2 bg-main-100 dark:bg-main-900">
                  {regionCountries.map((country, index) => {
                    const lastItem = regionCountries.length === index + 1;

                    return (
                      <div
                        style={{
                          cursor: "pointer",
                          color: darkMode ? "cyan" : "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          handleCountryClick(country.name);
                        }}
                        key={index}
                      >
                        {lastItem ? country.name : country.name + ", "}
                      </div>
                    );
                  })}
                </div>
              </Popover>
            </div>
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
  ];

  const filter = {
    field: "name",
    operator: "equals",
    value: filterValue,
    id: 2,
  };

  const handleVisibility = (id) => {
    const index = regions.findIndex((region) => region.id === id);
    changeVisibility({ id, field: "isVisible", type: "region" }).then(
      (data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setMessage(data.message);
        regions[index].isVisible = !regions[index].isVisible;
        setRegions([...regions]);
      }
    );
  };

  const handleEdit = (id) => {
    const index = regions.findIndex((region) => region.id === id);
    setEditData(regions[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  const refreshData = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    if (active && shouldFetch) {
      setLoading(true);
      admin
        .getRegions()
        .then((data) => {
          setRegions(data.body.regions);
          setShouldFetch(false);
        })
        .finally(() => setLoading(false));
    }
  }, [shouldFetch]);

  const handleCountryClick = useCallback(
    (countryName) => {
      navigate(`/admin?tab=country&value=${countryName}`);
    },
    [navigate]
  );
  const handleAreaClick = useCallback(
    (areaName) => {
      navigate(`/admin?tab=area&value=${areaName}`);
    },
    [navigate]
  );

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add Region
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((load, index) => <div key={index}>{load}</div>)
        ) : (
          <AdminTable
            rows={regions}
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
        <AddRegionModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          setAreas={setAreas}
          areas={areas}
          setRegions={setRegions}
          editData={editData}
          setEditData={setEditData}
        />
      )}
      <AdminChoiceModal
        open={choiceModal !== null}
        setOpen={() => setChoiceModal(null)}
        message={"Are you sure you want to delete this region?"}
        actionFunction={() =>
          deleteLocation({ id: choiceModal, type: "region" }).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setRegions(regions.filter((region) => region.id !== choiceModal));
              setShouldFetch(true);
            } else {
              setError(data.message);
            }
            setChoiceModal(null);
          })
        }
      />
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
    </div>
  );
};

export default RegionTabs;
