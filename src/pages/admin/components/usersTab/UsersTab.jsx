import { useEffect, useRef, useState } from "react";
import styles from "./usersTab.module.css";
import AdminHugeTable from "../adminHugeTable/AdminHugeTable";
import AdminChoiceModal from "../AdminChoiceModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import { Box, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import userService from "@/services/user";
import { useSelector } from "react-redux";
import BlockIcon from "@mui/icons-material/Block";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";

export default function UsersTab({ darkMode, active }) {
  const user = useSelector((state) => state.user);
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 35);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState({ id: null, type: null });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleUsers, setVisibleUsers] = useState({});
  const [users, setUsers] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
  });

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);
      userService
        .getAllUsers(PAGE_SIZE, offset, user.token)
        .then((data) => {
          if (data.ok) {
            if (totalRows === 0) {
              setTotalRows(data.body.total);
            }
            setUsers((prevUsers) => [...prevUsers, ...data.body.users]);
            setVisibleUsers((prevUsers) => ({
              ...prevUsers,
              [offset]: data.body.users,
            }));
          }
        })
        .finally(() => setLoading(false));
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const refreshData = () => {
    setShouldFetch(true);
  };

  const handleDelteUser = (id) => {
    userService
      .deleteUser(id, user.token)
      .then((data) => {
        if (data.ok) {
          setMessage(data.message);
          refreshData();
        } else {
          setError(data.message);
        }
        setChoiceModal({ id: null, type: null });
      })
      .finally(() => refreshData());
  };

  const handleBlockUser = (id) => {
    userService
      .blockUser(id, user.token)
      .then((data) => {
        if (data.ok) {
          setMessage(data.message);
          setUsers(users.filter((user) => user.id !== id));
        } else {
          setError(data.message);
        }
        setChoiceModal({ id: null, type: null });
      })
      .finally(() => refreshData());
  };

  const handleAdminUser = (id) => {
    userService
      .makeAdmin(id, user.token)
      .then((data) => {
        if (data.ok) {
          setMessage(data.message);
          setUsers(users.filter((user) => user.id !== id));
        } else {
          setError(data.message);
        }
        setChoiceModal({ id: null, type: null });
      })
      .finally(() => refreshData());
  };

  const columns = [
    //{ field: "id", headerName: "ID", width: 150 },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Full Name",
      flex: 2,
      renderCell: (params) => `${params.row.name} ${params.row.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 2,
    },
    {
      field: "hasShop",
      headerName: "Has Shop",
      flex: 1,
    },

    // {
    //   field: "Shop.name",
    //   headerName: "Shop",
    //   flex: 1,
    //   renderCell: (params) => params.row.Shop.name,
    // },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className={styles.actions}>
          {params.row.blocked ? (
            <Tooltip title="Unblock User" arrow>
              <IconButton
                onClick={() => {
                  setChoiceModal({
                    id: params.row.id,
                    type: "unblockUser",
                  });
                }}
              >
                <BlockIcon color="error" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Block User" arrow>
              <IconButton
                onClick={() => {
                  setChoiceModal({
                    id: params.row.id,
                    type: "blockUser",
                  });
                }}
              >
                <CheckIcon color="success" />
              </IconButton>
            </Tooltip>
          )}
          {user.isSuperAdmin &&
            (params.row.isAdmin ? (
              <Tooltip title="Remove Admin" arrow>
                <IconButton
                  onClick={() => {
                    setChoiceModal({
                      id: params.row.id,
                      type: "removeAdmin",
                    });
                  }}
                >
                  <AdminPanelSettingsIcon color="error" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Make Admin" arrow>
                <IconButton
                  onClick={() => {
                    setChoiceModal({
                      id: params.row.id,
                      type: "makeAdmin",
                    });
                  }}
                >
                  <AdminPanelSettingsIcon color="primary" />
                </IconButton>
              </Tooltip>
            ))}
          {user.isSuperAdmin && (
            <Tooltip title="Delete User" arrow>
              <IconButton
                onClick={() => {
                  setChoiceModal({
                    id: params.row.id,
                    type: "deleteUser",
                  });
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Box sx={{ height: "100%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <DataGrid
            columns={columns}
            rows={
              visibleUsers[offset] && visibleUsers[offset].length > 0
                ? visibleUsers[offset]
                : { id: 0, name: "No users found" }
            }
            rowCount={totalRows}
            paginationMode="server"
            pageSizeOptions={[PAGE_SIZE]}
            loading={loading}
            onPaginationModelChange={(params) => handlePageChange(params.page)}
            initialState={{
              pagination: { paginationModel: { PAGE_SIZE, page } },
              filter: {
                filterModel: {
                  items: [
                    {
                      field: "isVisible",
                      operator: "equals",
                      value: "true",
                      id: "1",
                    },
                  ],
                },
              },
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            density="compact"
            sx={{
              backgroundColor: darkMode ? "#555" : "#fbfbfb",
              color: darkMode ? "white" : "black",
            }}
          />
        )}
      </Box>
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
        open={choiceModal.id !== null}
        setOpen={() => setChoiceModal({ id: null, type: null })}
        message={
          choiceModal.type === "blockUser"
            ? "Are you sure you want to block this user?"
            : choiceModal.type === "unblockUser"
            ? "Are you sure you want to unblock this user?"
            : choiceModal.type === "makeAdmin"
            ? "Are you sure you want to make this user an admin?"
            : choiceModal.type === "removeAdmin"
            ? "Are you sure you want to remove this user's admin privileges?"
            : choiceModal.type === "deleteUser"
            ? "Are you sure you want to delete this user?"
            : null
        }
        actionFunction={() => {
          if (choiceModal.type === "blockUser") {
            handleBlockUser(choiceModal.id);
          } else if (choiceModal.type === "unblockUser") {
            handleBlockUser(choiceModal.id);
          } else if (choiceModal.type === "makeAdmin") {
            handleAdminUser(choiceModal.id);
          } else if (choiceModal.type === "removeAdmin") {
            handleAdminUser(choiceModal.id);
          } else if (choiceModal.type === "deleteUser") {
            handleDelteUser(choiceModal.id);
          }
        }}
      />
    </div>
  );
}
