import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";

export default function AdminTable({
  columns,
  columnsVisibility,
  rows,
  pageSize,
  darkMode,
  filter,
  handleEdit,
  handleVisibility,
  handleDelete,
}) {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState(columnsVisibility);

  const setColumns = () => {
    const fields = columns.map((column) => {
      if (column.field === "updatedAt") {
        return {
          key: column.field,
          field: "updatedAt",
          headerName: "Updated at",
          width: 125,
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
        };
      }
      if (column.field === "Images") {
        return {
          key: column.field,
          field: "Images",
          headerName: "Images",
          width: 100,
          renderCell: (params) => <div> {params.row.Images?.length}</div>,
        };
      }
      if (column.custom) {
        return {
          key: column.field,
          field: column.field,
          headerName: column.field[0].toUpperCase() + column.field.slice(1),
          flex: 1,
          renderCell: (params) => <div> {column.renderCell(params)}</div>,
        };
      }
      return {
        key: column.field,
        field: column.field,
        headerName: column.field[0].toUpperCase() + column.field.slice(1),
        flex: 1,
      };
    });

    fields.push({
      type: "actions",
      field: "Actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={
              <EditIcon
                fontSize={16}
                color={!handleEdit ? "disabled" : "success"}
              />
            }
            label="Edit"
            className="textPrimary"
            onClick={() => handleEdit(params.id)}
            disabled={!handleEdit}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              !params.row.isVisible ? (
                <VisibilityOffIcon fontSize={16} color="disabled" />
              ) : (
                <VisibilityIcon fontSize={16} color="info" />
              )
            }
            label="Visible"
            className="textPrimary"
            onClick={() => handleVisibility(params.id)}
            color="inherit"
            disabled={!handleVisibility}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon fontSize={16} color="error" />}
            label="Delete"
            onClick={() => handleDelete(params.id)}
          />,
        ];
      },
    });
    return fields;
  };

  return (
    <DataGrid
      columns={setColumns()}
      rows={rows}
      pageSizeOptions={[pageSize]}
      initialState={{
        pagination: { paginationModel: { pageSize } },
        filter: {
          filterModel: {
            items: [
              filter
                ? filter
                : {
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
  );
}
