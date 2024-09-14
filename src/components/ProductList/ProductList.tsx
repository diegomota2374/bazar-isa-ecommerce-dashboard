"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface ProductListProps {
  rows: Array<{
    id: number;
    name: string;
    status: string;
    category: string;
    price: number | null;
    imgProduct: string;
  }>;
}

const ProductList: React.FC<ProductListProps> = ({ rows }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //Função para renderizar a imagem em miniatura
  const renderImageCell = (params: GridRenderCellParams) => {
    return (
      <img
        src={params.value}
        alt="Product"
        style={{
          width: 50,
          height: 50,
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    );
  };

  const columns: GridColDef[] = isMobile
    ? [
        {
          field: "imgProduct",
          headerName: "Foto",
          width: 230,
          flex: 1,
          renderCell: renderImageCell,
        },
        { field: "status", headerName: "Status", width: 130, flex: 1 },
      ]
    : [
        {
          field: "imgProduct",
          headerName: "Foto",
          width: 230,
          flex: 1,
          renderCell: renderImageCell,
        },
        { field: "name", headerName: "Nome", width: 230, flex: 1 },
        { field: "status", headerName: "Status", width: 130, flex: 1 },
        { field: "category", headerName: "Categoria", width: 130, flex: 1 },
        {
          field: "price",
          headerName: "Preço",
          type: "number",
          width: 90,
          flex: 1,
        },
      ];

  const paginationModel = { page: 0, pageSize: isMobile ? 4 : 7 };

  return (
    <Paper
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: isMobile ? "0px" : "16px",
        boxSizing: "border-box",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        style={{ border: 0, flexGrow: 1 }}
        autoHeight
      />
    </Paper>
  );
};

export default ProductList;
