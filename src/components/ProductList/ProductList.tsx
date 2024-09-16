"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

interface ProductListProps {
  rows: Array<{
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    discount?: number;
    status: string;
    state: string;
    imgProduct: FileList;
  }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
}

//Define styles for the status
const StatusCell = styled(Typography)(({ status }: { status: string }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "4px",
  padding: "4px 8px",
  color: "#fff",
  backgroundColor:
    status === "Disponível"
      ? "#4caf50"
      : status === "Reservado"
      ? "#ff9800"
      : "#f44336",
}));

const ProductList: React.FC<ProductListProps> = ({
  rows,
  onDelete,
  onEdit,
  onDeleteSelected,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false); // Estado para abrir o modal
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);

  // Função para abrir o modal de confirmação
  const handleOpen = (id: string) => {
    setSelectedId(id);
    setIsMultipleDelete(false);
    setOpen(true);
  };

  const handleOpenMultipleDelete = () => {
    setIsMultipleDelete(true);
    setOpen(true);
  };

  // Função para fechar o modal de confirmação
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (selectedId) {
      onDelete(selectedId);
    }
    handleClose();
  };

  //Função para excluir os produtos selecionados
  const handleConfirmDeleteSelected = () => {
    onDeleteSelected(selectedIds);
    setSelectedIds([]);
    handleClose();
  };

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

  //Função para renderizar a célula de status com cores diferentes
  const renderStatusCell = (params: GridRenderCellParams) => {
    return (
      <StatusCell status={params.value as string}>{params.value}</StatusCell>
    );
  };

  //Função para renderizar os boões de ação (editar e deletar)
  const renderActionCell = (params: GridRenderCellParams) => {
    return (
      <Fade in timeout={500}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => onEdit(String(params.id))}
            color="primary"
            aria-label="editar"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpen(String(params.id))}
            color="secondary"
            aria-label="excluir"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </Fade>
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
          disableColumnMenu: true,
          sortable: false,
        },
        {
          field: "status",
          headerName: "Status",
          disableColumnMenu: true,
          width: 130,
          flex: 1,
          renderCell: renderStatusCell,
        },
        {
          field: "actions",
          headerName: "",
          width: 150,
          flex: 1,
          renderCell: renderActionCell,
          disableColumnMenu: true,
          sortable: false,
        },
      ]
    : [
        {
          field: "imgProduct",
          headerName: "Foto",
          width: 230,
          flex: 1,
          renderCell: renderImageCell,
          disableColumnMenu: true,
          sortable: false,
        },
        { field: "name", headerName: "Nome", width: 230, flex: 1 },
        {
          field: "status",
          headerName: "Status",
          width: 130,
          flex: 1,
          renderCell: renderStatusCell,
        },
        { field: "category", headerName: "Categoria", width: 130, flex: 1 },
        { field: "state", headerName: "Estado", width: 130, flex: 1 },
        {
          field: "price",
          headerName: "Preço",
          type: "number",
          width: 90,
          flex: 1,
        },
        {
          field: "discount",
          headerName: "Desconto",
          type: "number",
          width: 90,
          flex: 1,
        },
        {
          field: "actions",
          headerName: "",
          width: 150,
          flex: 1,
          renderCell: renderActionCell,
          disableColumnMenu: true,
          sortable: false,
        },
      ];

  const paginationModel = { page: 0, pageSize: isMobile ? 5 : 10 };

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
      {/* Botão de excluir selecionados */}
      {selectedIds.length > 0 && (
        <Box sx={{ paddingTop: 2, paddingRight: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenMultipleDelete}
          >
            Excluir Selecionados
          </Button>
        </Box>
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedIds(ids as string[])}
        style={{ border: 0, flexGrow: 1 }}
        autoHeight
      />
      {/* Modal de confirmação */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {isMultipleDelete
              ? "Tem certeza que deseja excluir os produtos selecionados?"
              : "Tem certeza que deseja excluir este produto?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={
              isMultipleDelete
                ? handleConfirmDeleteSelected
                : handleConfirmDelete
            }
            color="secondary"
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductList;
