"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns: GridColDef[] = isMobile
    ? [
        { field: "name", headerName: "Nome", width: 230, flex: 2 },
        { field: "status", headerName: "Status", width: 130, flex: 1 },
        {
          field: "price",
          headerName: "Preço",
          type: "number",
          width: 90,
          flex: 1,
        },
      ]
    : [
        { field: "id", headerName: "ID", width: 70, flex: 1 },
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

  const rows = [
    { id: 1, name: "Snow", status: "Ativo", category: "Geral", price: 35 },
    {
      id: 2,
      name: "Lannister",
      status: "Inativo",
      category: "Realeza",
      price: 42,
    },
    {
      id: 3,
      name: "Lannister",
      status: "Ativo",
      category: "Realeza",
      price: 45,
    },
    { id: 4, name: "Stark", status: "Ativo", category: "Geral", price: 16 },
    {
      id: 5,
      name: "Targaryen",
      status: "Ativo",
      category: "Realeza",
      price: null,
    },
    {
      id: 6,
      name: "Melisandre",
      status: "Inativo",
      category: "Mística",
      price: 150,
    },
    { id: 7, name: "Ferrara", status: "Ativo", category: "Comum", price: 44 },
    { id: 8, name: "Rossini", status: "Inativo", category: "Comum", price: 36 },
    { id: 9, name: "Harvey", status: "Ativo", category: "Geral", price: 65 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      {isMobile ? (
        <Paper
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "0px",
            boxSizing: "border-box",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            style={{ border: 0, flexGrow: 1 }}
            autoHeight
          />
        </Paper>
      ) : (
        <PageContainer
          title="Lista de Produtos"
          description="Esta página manipula os produtos"
        >
          <DashboardCard title="Lista de Produtos">
            <Paper
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                style={{ border: 0, flexGrow: 1 }}
                autoHeight
              />
            </Paper>
          </DashboardCard>
        </PageContainer>
      )}
    </>
  );
};

export default ProductPage;
