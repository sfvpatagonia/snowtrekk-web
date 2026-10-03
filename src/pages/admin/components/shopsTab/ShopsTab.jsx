import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { MenuItem, Select, Skeleton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AdminTable from "../adminTable/AdminTable";
import admin from "@/services/admin";
import changeVisibility from "@/services/changeVisibility";
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
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // "all" | "visible" | "hidden"

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
  }, [user.token]);

  const filteredShops = useMemo(() => {
    if (visibilityFilter === "visible") {
      return shops.filter((shop) => shop.isVisible === true);
    }
    if (visibilityFilter === "hidden") {
      return shops.filter((shop) => shop.isVisible === false);
    }
    return shops;
  }, [shops, visibilityFilter]);

  const handleEdit = (id) => {
    setSelectedShop(shops.find((shop) => shop.id === id));
    setOpen(true);
  };

  const handleTogglePreferred = (id) => {
    const index = shops.findIndex((shop) => shop.id === id);
    changeVisibility({ id, field: "isPreferred", type: "shop" }).then(
      (data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setMessage(data.message);
        shops[index].isPreferred = !shops[index].isPreferred;
        setShops([...shops]);
      },
    );
  };

  const handleToggleVisible = (id) => {
    const index = shops.findIndex((shop) => shop.id === id);
    changeVisibility({ id, field: "isVisible", type: "shop" }).then(
      (data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setMessage(data.message);
        shops[index].isVisible = !shops[index].isVisible;
        setShops([...shops]);
      },
    );
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
    {
      field: "isPreferred",
      custom: true,
      renderCell: (params) => (
        <button
          onClick={() => handleTogglePreferred(params.row.id)}
          title="Confirmed commercial agreement"
        >
          {params.row.isPreferred ? (
            <StarIcon fontSize="small" style={{ color: "#f5b301" }} />
          ) : (
            <StarBorderIcon fontSize="small" color="disabled" />
          )}
        </button>
      ),
    },
    {
      field: "isVisible",
      custom: true,
      renderCell: (params) => (
        <button
          onClick={() => handleToggleVisible(params.row.id)}
          title="IsVisible"
        >
          {params.row.isVisible ? (
            <VisibilityIcon fontSize="small" style={{ color: "#f5b301" }} />
          ) : (
            <VisibilityOffIcon fontSize="small" color="disabled" />
          )}
        </button>
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
      <Select
        value={visibilityFilter}
        onChange={(e) => setVisibilityFilter(e.target.value)}
        size="small"
      >
        <MenuItem value="all">Todos</MenuItem>
        <MenuItem value="visible">Visibles</MenuItem>
        <MenuItem value="hidden">Ocultos</MenuItem>
      </Select>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={filteredShops}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            disableDefaultVisibleFilter
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
