import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import deleteLead from "@/services/deleteLead";
import { Popover, Skeleton, TextField } from "@mui/material";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import admin from "@/services/admin";
import AdminChoiceModal from "../AdminChoiceModal";
import changeVisibility from "@/services/changeVisibility";
import AddLeadModal from "./components/AddLeadModal";
import AdminHugeTable from "../adminHugeTable/AdminHugeTable";
import SendEmailModal from "./components/SendEmailModal";

const ClientLeadsTab = ({ darkMode, active, data }) => {
  const {
    leads,
    setLeads,
    destinations,
    setDestinations,
    activities,
    setActivities,
  } = data;
  dayjs.extend(relativeTime);
  const popRef = useRef();
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 35);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);

  const [offset, setOffset] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popover, setPopover] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const [visibleLeads, setVisibleLeads] = useState({});
  const [openEmailModal, setOpenEmailModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [cachedLeads, setCachedLeads] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
    x: false,
    facebook: false,
    tiktok: false,
    youtube: false,
    phone: false,
    responsableName: false,
    instagram: false,
    isVisible: false,
    isClient: false,
    location: true,
  });

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    //{ field: "id", headerName: "ID", width: 150 },
    {
      field: "companyName",
    },
    {
      field: "responsableName",
    },
    {
      field: "email",
    },
    {
      field: "website",
    },
    {
      field: "facebook",
    },
    {
      field: "instagram",
    },
    {
      field: "x",
    },
    {
      field: "tiktok",
    },
    {
      field: "youtube",
    },
    {
      field: "phone",
    },
    {
      field: "clientDestinations",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;
        if (params.row.clientDestinations?.length === 0) {
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
                {params.row.clientDestinations?.map((destination, index) => {
                  const lastItem =
                    params.row.clientDestinations?.length === index + 1;
                  return lastItem ? destination.name : destination.name + ", ";
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
                  {params.row.clientDestinations?.map((destination, index) => {
                    const lastItem =
                      params.row.clientDestinations?.length === index + 1;
                    return (
                      <div
                        style={{
                          cursor: "pointer",
                          color: darkMode ? "cyan" : "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleCityClick(destination.name)}
                        key={index}
                      >
                        {destination.name}
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
      field: "clientActivities",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;
        if (params.row.clientActivities?.length === 0) {
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
                {params.row.clientActivities?.map((activity, index) => {
                  const lastItem =
                    params.row.clientActivities?.length === index + 1;
                  return lastItem ? activity.name : activity.name + ", ";
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
                  {params.row.clientActivities?.map((activity, index) => {
                    const lastItem =
                      params.row.clientActivities?.length === index + 1;
                    return (
                      <div
                        style={{
                          cursor: "pointer",
                          color: darkMode ? "cyan" : "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleCityClick(activity.name)}
                        key={index}
                      >
                        {activity.name}
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
      field: "languages",
      custom: true,
      renderCell: (params) => {
        const rowId = params.id;
        if (!params.row.languages || params.row.languages?.length === 0) {
          return <div>---</div>;
        }

        return (
          <>
            <div
              aria-describedby={rowId}
              variant="contained"
              onClick={(e) => {
                setPopover(e.currentTarget);
                setPopoverOpen(`${rowId}-languages`);
              }}
            >
              <div>
                {params.row.languages?.map((language, index) => {
                  const lastItem = params.row.languages?.length === index + 1;
                  return lastItem ? language.name : language.name + ", ";
                })}
              </div>
            </div>
            <div>
              <Popover
                ref={popRef}
                id={rowId}
                open={popoverOpen === `${rowId}-languages`}
                onClose={() => setPopoverOpen(false)}
                anchorEl={popover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col p-4 rounded-lg gap-2 bg-main-100 dark:bg-main-900">
                  {" "}
                  {params.row.languages?.map((language, index) => {
                    const lastItem = params.row.languages?.length === index + 1;
                    return (
                      <div key={index}>
                        {language.name}
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
    { field: "notes" },
    { field: "location" },
    {
      field: "isClient",
      headerName: "Cliente",
      width: 100,
      renderCell: (params) => <div> {params.row.isClient ? "Yes" : "No"}</div>,
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      flex: 1,
      valueGetter: (params) => dayjs(params.row.updatedAt),
      renderCell: (params) => {
        const diffDays = dayjs().diff(params.value, "day");
        const displayText =
          diffDays === 0
            ? "today"
            : diffDays === 1
            ? "yesterday"
            : dayjs().to(params.value);
        return <div>{displayText}</div>;
      },
      sortComparator: (date1, date2) => date1.unix() - date2.unix(),
    },
  ];

  useEffect(() => {
    if (!active || !shouldFetch || searchQuery !== "") return;

    setLoading(true);

    if (visibleLeads[offset]) {
      // Ya tenemos los datos cacheados para esta página
      setLoading(false);
      return;
    }

    admin.getLeads(PAGE_SIZE, offset).then((data) => {
      if (!data.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      if (totalRows === 0) {
        setTotalRows(data.body.total);
      }

      setLeads((prev) => [...prev, ...data.body.leads]);
      setVisibleLeads((prev) => {
        const updated = { ...prev, [offset]: data.body.leads };
        setCachedLeads(updated); // Guardamos para restaurar después si se borra la búsqueda
        return updated;
      });

      setLoading(false);
      setShouldFetch(false);
    });
  }, [active, offset, shouldFetch, searchQuery]);

  const refreshData = () => {
    setShouldFetch(true);
  };

  const handleVisibility = (id) => {
    const index = leads.findIndex((lead) => lead.id === id);
    changeVisibility({ id, field: "isVisible", type: "leads" }).then((data) => {
      if (!data.ok) {
        return setError(data.message);
      }
      setMessage(data.message);
      leads[index].isVisible = !leads[index].isVisible;
      setLeads([...leads]);
    });
  };

  const handleEdit = (id) => {
    const index = leads.findIndex((lead) => lead.id === id);
    setEditData(leads[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <TextField
          placeholder="Search by company, responsable, email, destination or activity"
          value={searchQuery}
          fullWidth
          size="small"
          sx={{ flex: 1, minWidth: "430px" }}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            setOffset(0); // volver a la primera página

            if (value === "") {
              // restaurar paginación
              setVisibleLeads(cachedLeads);
              setLeads(Object.values(cachedLeads).flat());
            } else {
              // buscar
              admin.searchLeads(value, PAGE_SIZE, 0).then((res) => {
                if (res.ok) {
                  setVisibleLeads({ 0: res.body.leads });
                  setLeads(res.body.leads);
                }
              });
            }
          }}
        />
        <button
          className="button"
          onClick={() => setOpenEmailModal(true)}
          disabled={selectedClients.length === 0}
        >
          Send mail
        </button>
        <button className="button" onClick={() => setAddModal(true)}>
          Add Lead
        </button>
      </div>
      <Box sx={{ height: "100%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminHugeTable
            rows={visibleLeads[offset] || []}
            totalRows={totalRows}
            columns={columns}
            pageSize={PAGE_SIZE}
            setOffset={setOffset}
            darkMode={darkMode}
            columnsVisibility={columnVisibilityModel}
            setSelectedClients={setSelectedClients}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleVisibility={handleVisibility}
            refreshData={refreshData}
            page={page}
            setPage={setPage}
            loading={loading}
          />
        )}
      </Box>
      {addModal && (
        <AddLeadModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          leads={leads}
          setLeads={setLeads}
          editData={editData}
          setEditData={setEditData}
          destinations={destinations}
          setDestinations={setDestinations}
          activities={activities}
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
        message={"Are you sure you want to delete this Lead?"}
        actionFunction={() =>
          deleteLead(choiceModal).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setLeads(leads.filter((lead) => lead.id !== choiceModal));
            } else {
              setError(data.message);
            }
            setChoiceModal(null);
          })
        }
      />
      <SendEmailModal
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        clients={leads.filter((lead) => selectedClients.includes(lead.id))}
        setConfirm={setMessage}
        setError={setError}
      />
    </div>
  );
};

export default ClientLeadsTab;
