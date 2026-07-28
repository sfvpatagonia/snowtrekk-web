import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import AdminTable from "../adminTable/AdminTable";
import admin from "@/services/admin";
import { useSelector } from "react-redux";
import ShopModal from "./components/ShopModal";
import EditShopModal from "./components/EditShopModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import StoreApplicationsPanel from "./components/StoreApplicationsPanel";
const ShopsTab = ({ darkMode }) => {
  const user = useSelector((state) => state.user);

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedShop, setSelectedShop] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(null);

  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);

  const loadingGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  useEffect(() => {
    admin.getShops(user.token).then((data) => {
      setShops(data.body.shops);
      setLoading(false);
    });
  }, []);

  const handleEdit = (id) => {
    setSelectedShop(shops.find((shop) => shop.id === id));
    setOpen(true);
  };

  const columns = [
    { field: "name" },

    { field: "email" },

    // { field: "type" },
    {
      field: "services",
      custom: true,
      renderCell: (params) => params.row.Services.length,
    },
    {
      field: "details",
      custom: true,
      renderCell: (params) => (
        <button className="button" onClick={() => handleEdit(params.row.id)}>
          See more
        </button>
      ),
    },
    {
      field: "isNew",
      custom: true,
      renderCell: (params) => (
        <div>
          {params.row.isNew ? (
            <span className="font-black text-main-400">NEW!!!</span>
          ) : (
            <span>---</span>
          )}{" "}
        </div>
      ),
    },
    // {
    //   field: "average Rating",
    //   custom: true,
    //   renderCell: (params) => {
    //     const score = calculateShopAverageScore(params.row.Services);
    //     return score ?? "No reviews";
    //   },
    // },

    // {
    //   field: "total views",
    //   custom: true,
    //   renderCell: (params) => {
    //     return calculateShopViews(params.row.Services);
    //   },
    // },
    // {
    //   field: "owner",
    //   custom: true,
    //   renderCell: (params) => {
    //     const owner = params.row.users.find(
    //       (user) => user.UsersShop.role === "creator",
    //     );
    //     if (!owner) return "---";
    //     // return `${owner.name} ${owner.lastName}`;
    //     return owner.email;
    //   },
    // },
  ];

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <StoreApplicationsPanel setError={setError} setMessage={setMessage} />
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={shops}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            handleEdit={(id) => {
              setSelectedShop(shops.find((shop) => shop.id === id));
              setEditModalOpen(true);
            }}
            columnsVisibility={{}}
          />
        )}
      </Box>
      <ShopModal
        open={open}
        shop={selectedShop}
        onClose={() => setOpen(false)}
        setError={setError}
        setMessage={setMessage}
        setShop={setSelectedShop}
      />
      <EditShopModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        shopData={selectedShop}
        setError={setError}
        setMessage={setMessage}
        setShops={setShops}
      />
      <AdminErrorModal
        open={error !== null}
        setOpen={() => setError(null)}
        error={error}
      />
      <AdminConfirmationModal
        open={message !== ""}
        setOpen={() => setMessage("")}
        message={message}
      />
    </div>
  );
};

export default ShopsTab;
