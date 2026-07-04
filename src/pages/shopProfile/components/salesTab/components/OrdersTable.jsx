import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatIcon from "@mui/icons-material/Chat";
import OrderDetail from "./OrderDetail";
import OrdersMobileCards from "./OrdersMobileCards";

const OrdersTable = ({ orders }) => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { field: "orderNumber", headerName: "Order Number", flex: 1 },
    { field: "client", headerName: "Client", flex: 1 },
    {
      field: "orderTotal",
      headerName: "Total",
      valueFormatter: ({ value }) => `$${value.toFixed(2)}`,
    },
    {
      field: "createdAt",
      headerName: "Date",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    { field: "status", headerName: "Status" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const { orderNumber, idUser } = params.row;
        return (
          <div className="flex gap-2">
            <Tooltip title="View Order">
              <VisibilityIcon
                className="text-blue-500 cursor-pointer"
                onClick={() => handleOpenModal(params.row)}
              />
            </Tooltip>

            <Tooltip title="Chat with Client">
              <ChatIcon
                className="text-green-500 cursor-pointer"
                onClick={() => navigate(`/user/${idUser}/chat/${orderNumber}`)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const rows = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    client: `${order.user?.name || "N/A"} ${order.user?.lastName || ""}`,
    orderTotal: order.orderTotal,
    createdAt: order.createdAt,
    status: order.status,
    idUser: order.idUser,
    ...order,
  }));

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const pageSize = 10;

  return (
    <div className="w-full">
      {/* 📱 Mobile view (cards) */}
      <OrdersMobileCards
        orders={orders}
        handleOpenModal={handleOpenModal}
        navigate={navigate}
      />

      {/* 💻 Desktop DataGrid */}
      <div className="hidden lg:block">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize } },
          }}
        />
      </div>

      <OrderDetail
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrdersTable;
