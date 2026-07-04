import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import BasicModal from "@/components/basicModal/BasicModal";
import Box from "@mui/material/Box";
import { Skeleton, TextField } from "@mui/material";
import setCountryField from "@/services/setCountryField";
import AdminConfirmationModal from "./adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "./adminErrorModal/AdminErrorModal";
import UploadImageModal from "@/components/UploadImageModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import admin from "@/services/admin.js";

const CountryTab = ({ darkMode, active, data }) => {
  const [countries, setCountries] = data;

  dayjs.extend(relativeTime);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const gridRef = useRef();
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 34);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterValue = searchParams.get("value");
  const [editData, setEditData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    //{ field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 4,
    },
    {
      field: "Images",
      headerName: "Images",
      flex: 1,
      renderCell: (params) => <div> {params.row.Images?.length}</div>,
    },
    {
      field: "isVisible",
      headerName: "Visible",
      width: 100,
      renderCell: (params) => <div> {params.row.isVisible ? "Yes" : "No"}</div>,
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
    if (active) {
      setLoading(true);

      admin.getCountries().then((data) => {
        setCountries(data.body.countries);
      });

      setLoading(false);
    }
  }, [refresh]);

  const editField = (e) => {
    if (e.colDef.field === "description") {
      setOpenEditModal(true);
      setEditData({
        title: e.colDef.headerName,
        value: e.value,
        prevValue: e.value,
        field: e.field,
        id: e.id,
      });
    }
    if (e.colDef.field === "Images") {
      setEditData({
        title: e.colDef.headerName,
        value: e.value,
        prevValue: e.value,
        field: e.field,
        id: e.id,
        type: "country",
      });
      setOpenImageModal(true);
    }
    if (e.colDef.field === "isVisible") {
      setEditData({
        title: e.colDef.headerName,
        value: !e.value,
        prevValue: e.value,
        field: e.field,
        id: e.id,
        type: "country",
      });
      setShouldSubmit(true);
    }
  };

  useEffect(() => {
    if (shouldSubmit && editData !== null) {
      handleSubmit();
      setShouldSubmit(false); // Reset the flag after submit
    }
  }, [shouldSubmit, editData]);

  const initialState =
    filterValue !== ""
      ? {
          pagination: {
            paginationModel: {
              pageSize: PAGE_SIZE,
            },
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: "name",
                  operator: "equals",
                  value: filterValue,
                },
                {
                  field: "isVisible",
                  operator: "equals",
                  value: "true",
                },
              ],
            },
          },
        }
      : {
          pagination: {
            paginationModel: {
              pageSize: PAGE_SIZE,
            },
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: "isVisible",
                  operator: "equals",
                  value: "true",
                },
              ],
            },
          },
        };
  const handleSubmit = (e) => {
    e && e.preventDefault();

    if (editData.prevValue === editData.value) {
      return setError(
        `The new ${editData.title} must be different than the previous one`
      );
    }

    if (editData.prevValue !== editData.value) {
      setCountryField(editData).then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setOpenEditModal(false);
        setMessage(data.message);
      });
      setRefresh((refresh) => !refresh);
    }
  };
  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  return (
    <div>
      <Box sx={{ height: "100%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <DataGrid
            apiRef={gridRef}
            rows={countries}
            columns={columns}
            initialState={initialState}
            pageSizeOptions={[PAGE_SIZE]}
            density="compact"
            disableRowSelectionOnClick
            checkboxSelection
            onCellDoubleClick={editField}
            sx={{
              backgroundColor: darkMode ? "#555" : "#fbfbfb",
              color: darkMode ? "white" : "black",
            }}
          />
        )}
      </Box>
      <BasicModal open={openEditModal} setOpen={setOpenEditModal}>
        <div className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded-lg gap-4">
          <h3 className="text-2xl text-main-0 dark:text-main-1000">
            Edit field
          </h3>
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-8 py-0 px-8 flex-col"
          >
            <TextField
              label={editData.title}
              name={editData.field}
              value={editData.value}
              onChange={handleChange}
              rows={8}
              multiline
            />

            <button className="button" type="submit">
              Edit
            </button>
          </form>
        </div>
      </BasicModal>
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
      {openImageModal && (
        <UploadImageModal
          editData={editData}
          setError={setError}
          setMessage={setMessage}
          open={openImageModal}
          setOpen={setOpenImageModal}
          setShouldFetch={setRefresh}
        />
      )}
    </div>
  );
};

export default CountryTab;
