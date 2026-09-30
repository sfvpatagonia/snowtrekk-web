import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import deleteLead from "@/services/deleteLead";
import {
  MenuItem,
  Popover,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
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
import SearchIcon from "@mui/icons-material/Search";
import { normalizeUrl } from "@/utils/normalizeUrl";

// Kept well under the backend's default Sequelize pool.max (5, unconfigured
// in snowtrek-server/src/db.js) since that pool is shared with all other
// traffic hitting the server, not just this backfill.
const FULL_LOAD_CONCURRENCY = 3;

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
  const navigate = useNavigate();
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
  const [loadingAll, setLoadingAll] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popover, setPopover] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const [openEmailModal, setOpenEmailModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("visible"); // "visible" | "hidden" | "all"
  const fetchedOffsetsRef = useRef(new Set());
  const cachedLeadsRef = useRef([]);
  const fullLoadTriggeredRef = useRef(false);

  const [columnVisibilityModel] = useState({
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

  const handleDestinationClick = useCallback(
    (destinationName) => {
      navigate(`/admin?tab=destination&value=${destinationName}`);
    },
    [navigate]
  );

  const handleActivityClick = useCallback(
    (activityName) => {
      navigate(`/admin?tab=activity&value=${activityName}`);
    },
    [navigate]
  );

  const columns = [
    //{ field: "id", headerName: "ID", width: 150 },
    {
      field: "companyName",
      custom: true,
      renderCell: (params) => {
        const companyName = params.value || "";
        const location = params.row.location || "";
        const query = location ? `${companyName} ${location}` : companyName;
        return (
          <span
            title={companyName}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            {companyName}
            <button
              type="button"
              aria-label={`Search ${companyName} on the web`}
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <SearchIcon fontSize="inherit" />
            </button>
          </span>
        );
      },
    },
    {
      field: "responsableName",
      renderCell: (params) => (
        <span title={params.value || ""}>{params.value}</span>
      ),
    },
    {
      field: "email",
      renderCell: (params) => (
        <span title={params.value || ""}>{params.value}</span>
      ),
    },
    {
      field: "website",
      custom: true,
      renderCell: (params) => {
        const normalized = normalizeUrl(params.value);
        if (!normalized) {
          return <span title={params.value || ""}>{params.value}</span>;
        }
        return (
          <a
            href={normalized}
            title={normalized}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {params.value}
          </a>
        );
      },
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
                        onClick={() => handleDestinationClick(destination.name)}
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
                        onClick={() => handleActivityClick(activity.name)}
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
      field: "isVisible",
      type: "boolean",
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

    if (fetchedOffsetsRef.current.has(offset)) {
      setShouldFetch(false);
      return;
    }

    setLoading(true);

    admin.getLeads(PAGE_SIZE, offset).then((data) => {
      if (!data.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      if (totalRows === 0) {
        setTotalRows(data.body.total);
      }

      fetchedOffsetsRef.current.add(offset);
      setLeads((prev) => {
        const existingIds = new Set(prev.map((lead) => lead.id));
        const newLeads = data.body.brands.filter(
          (lead) => !existingIds.has(lead.id)
        );
        return [...prev, ...newLeads];
      });
      setLoading(false);
      setShouldFetch(false);
    });
  }, [active, offset, shouldFetch, searchQuery, PAGE_SIZE, setLeads, totalRows]);

  // Backfills every raw page not yet in `leads`, once, so the visibilityFilter
  // (which filters in-memory) isn't undercounting on pages nobody paginated to yet.
  useEffect(() => {
    if (!active || totalRows === 0 || fullLoadTriggeredRef.current) return;

    const missingOffsets = [];
    for (let o = 0; o < totalRows; o += PAGE_SIZE) {
      if (!fetchedOffsetsRef.current.has(o)) {
        missingOffsets.push(o);
      }
    }

    if (missingOffsets.length === 0) return;

    fullLoadTriggeredRef.current = true;
    setLoadingAll(true);

    const loadRemainingInChunks = async () => {
      let firstErrorMessage = null;

      for (let i = 0; i < missingOffsets.length; i += FULL_LOAD_CONCURRENCY) {
        const chunk = missingOffsets.slice(i, i + FULL_LOAD_CONCURRENCY);
        const results = await Promise.all(
          chunk.map((o) =>
            admin.getLeads(PAGE_SIZE, o).then((data) => ({ offset: o, data }))
          )
        );

        setLeads((prev) => {
          const existingIds = new Set(prev.map((lead) => lead.id));
          const newLeads = [];
          results.forEach((r) => {
            if (!r.data.ok) return;
            fetchedOffsetsRef.current.add(r.offset);
            r.data.body.brands.forEach((lead) => {
              if (!existingIds.has(lead.id)) {
                existingIds.add(lead.id);
                newLeads.push(lead);
              }
            });
          });
          return [...prev, ...newLeads];
        });

        if (!firstErrorMessage) {
          const failed = results.find((r) => !r.data.ok);
          if (failed) firstErrorMessage = failed.data.message;
        }
      }

      if (firstErrorMessage) {
        setError(firstErrorMessage);
      }
      setLoadingAll(false);
    };

    loadRemainingInChunks();
  }, [active, totalRows, PAGE_SIZE, setLeads]);

  const refreshData = () => {
    setShouldFetch(true);
  };

  const filteredLeads = useMemo(() => {
    if (visibilityFilter === "visible") {
      return leads.filter((lead) => lead.isVisible === true);
    }
    if (visibilityFilter === "hidden") {
      return leads.filter((lead) => lead.isVisible === false);
    }
    return leads;
  }, [leads, visibilityFilter]);

  const handleVisibilityFilterChange = (e) => {
    setVisibilityFilter(e.target.value);
    setOffset(0);
    setPage(0);
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
            if (searchQuery === "" && value !== "") {
              // arrancando una búsqueda: guardamos el listado actual para restaurarlo después
              cachedLeadsRef.current = leads;
            }
            setSearchQuery(value);
            setOffset(0); // volver a la primera página

            if (value === "") {
              // restaurar paginación
              setLeads(cachedLeadsRef.current);
            } else {
              // buscar
              admin.searchLeads(value, PAGE_SIZE, 0).then((res) => {
                if (res.ok) {
                  setLeads(res.body.brands);
                }
              });
            }
          }}
        />
        <Select
          value={visibilityFilter}
          onChange={handleVisibilityFilterChange}
          size="small"
        >
          <MenuItem value="visible">Visibles</MenuItem>
          <MenuItem value="hidden">Ocultas</MenuItem>
          <MenuItem value="all">Todas</MenuItem>
        </Select>
        {loadingAll && (
          <span className="text-main-0 dark:text-main-1000 self-center text-sm">
            Cargando todo…
          </span>
        )}
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
            rows={filteredLeads.slice(offset, offset + PAGE_SIZE)}
            totalRows={filteredLeads.length}
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
