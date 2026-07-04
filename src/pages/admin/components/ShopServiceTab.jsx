import { useEffect, useState } from "react";
import AdminErrorModal from "./adminErrorModal/AdminErrorModal";
import AdminConfirmationModal from "./adminConfirmationModal/AdminConfirmationModal";
import { Box, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import admin from "@/services/admin";
import { useSelector } from "react-redux";

export default function ShopServiceTab({ darkMode, active }) {
  const user = useSelector((state) => state.user);
  const PAGE_SIZE = Math.floor((window.innerHeight - 250) / 35);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleServices, setVisibleServices] = useState({});
  const [services, setServices] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: true,
  });

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);
      admin
        .getAllServices(PAGE_SIZE, offset, user.token)
        .then((data) => {
          if (data.ok) {
            if (totalRows === 0) {
              setTotalRows(data.body.total);
            }
            setServices((prevServices) => [
              ...prevServices,
              ...data.body.services,
            ]);
            setVisibleServices((prevServices) => ({
              ...prevServices,
              [offset]: data.body.services,
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

  const handleChangeAdvertise = (id) => {
    admin
      .changeAdvertise(id, user.token)
      .then((data) => {
        if (data.ok) {
          setMessage("The advertise has been changed");
          refreshData();
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
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
      headerName: "Name",
      flex: 1,
    },
    {
      field: "isAd",
      headerName: "Ad",
      flex: 1,
    },
    {
      field: "Shop.name",
      headerName: "Shop",
      flex: 1,
      renderCell: (params) => params.row.Shop.name,
    },

    {
      field: "Shop",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex w-full justify-end">
          <button
            className="button"
            onClick={() => {
              handleChangeAdvertise(params.row.id);
            }}
          >
            {params.row.isAd ? "Remove Ad" : "Advertise Service"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <Box sx={{ height: "100%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <DataGrid
            columns={columns}
            rows={visibleServices[offset] || []}
            rowCount={totalRows}
            paginationMode="server"
            pageSizeOptions={[PAGE_SIZE]}
            loading={loading}
            rowSelection={false}
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
    
    </div>
  );
}
