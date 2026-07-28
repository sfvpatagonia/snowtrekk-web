import { useSelector } from "react-redux";
import AdminTable from "../../adminTable/AdminTable";

const ShopServices = ({ services }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const columns = [
    { field: "name" },
    {
      field: "averageScore",
      custom: true,
      renderCell: (params) => params.row.averageScore ?? "No reviews",
    },
    {
      field: "views",
      custom: true,
      renderCell: (params) => params.row.views ?? "--",
    },
    { field: "sold" },
  ];

  return services.length === 0 ? (
    <p className="text-center text-gray-500 dark:text-gray-200 py-4">
      No services available
    </p>
  ) : (
    <div className="h-100 ">
      <div className="max-h-full overflow-auto">
        <AdminTable
          rows={services}
          columns={columns}
          pageSize={5}
          darkMode={darkMode}
          columnsVisibility={{}}
        />
      </div>
    </div>
  );
};

export default ShopServices;
