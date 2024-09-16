"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import ProductList from "@/components/ProductList/ProductList";
import {
  Alert,
  Box,
  Fab,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ProductForm from "@/components/ProductList/productForm";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  status: string;
  state: string;
  imgProduct: FileList;
}

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const urlApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  const token = localStorage.getItem("token");

  //Função apra buscar produtos da API
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${urlApi}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRows(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar produtos");
      setLoading(false);
    }
  };

  //useEffect para buscar dados assim que o componente for montado
  useEffect(() => {
    fetchProducts();
  }, []);

  //Função para remover acentuação de strings
  const removeAccents = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  //Função para filtrar as linhas de produtos com vase na busca
  const filteredRows = rows.filter((row) =>
    Object.keys(row).some((key) =>
      removeAccents(
        String(row[key as keyof typeof row]).toLowerCase()
      ).includes(removeAccents(searchValue.toLowerCase()))
    )
  );
  //Mostrar mensagem de erro se houuver um problema
  if (error) {
    return (
      <PageContainer title="Erro" description="Erro ao carregar produtos">
        <DashboardCard title="Erro">
          <Typography>{error}</Typography>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Carregando" description="Carregando produtos">
        <DashboardCard title="Carregando">
          <Typography>Carregando produtos...</Typography>
        </DashboardCard>
      </PageContainer>
    );
  }

  // Função onSuccess para lidar com o sucesso da criação do produto
  const onSuccess = () => {
    fetchProducts();
    setSuccessMessage("Produto criado com sucesso!");
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const productToEdit = rows.find((product) => product._id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${urlApi}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRows((prevProducts) => prevProducts.filter((row) => row._id !== id));

      fetchProducts();
      setSuccessMessage("Produto excluido com sucesso!");
    } catch (error) {
      alert("Erro ao excluir o produto. Por favor, tente novamente.");
    }
  };
  const handleDeleteSelected = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    try {
      //Deleta todos os produtos selecionados
      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`${urlApi}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
      );

      //Filtra os produtos excluidos da lista de produtos
      const updatedRows = rows.filter(
        (product) => !selectedIds.includes(product._id)
      );

      setRows(updatedRows);
      setSuccessMessage("Produtos excluídos com sucesso!");
    } catch (err) {
      console.log("Erro ao excluir produtos selecionados:", err);
      setErrorMessage("Erro ao excluir produtos");
    }
  };

  return (
    <PageContainer
      title="Lista de Produtos"
      description="Esta página manipula os produtos"
    >
      {showForm ? (
        <DashboardCard>
          <ProductForm
            onCancel={() => setShowForm(false)}
            onSuccess={onSuccess}
            editingProduct={editingProduct}
          />
        </DashboardCard>
      ) : (
        <>
          {/* Exibe mensagem de sucesso se o produto for criado */}
          {successMessage && (
            <Snackbar
              open={!!successMessage}
              autoHideDuration={3000}
              onClose={() => setSuccessMessage(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              {successMessage ? (
                <Alert
                  onClose={() => setSuccessMessage(null)}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {successMessage}
                </Alert>
              ) : (
                <Alert
                  onClose={() => setErrorMessage(null)}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {errorMessage}
                </Alert>
              )}
            </Snackbar>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingY: "16px",
            }}
          >
            <TextField
              label="Buscar"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar por nome, preço, status..."
              size="small"
              sx={{ width: isMobile ? "100%" : "300px" }}
            />
          </Box>
          <ProductList
            rows={filteredRows}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDeleteSelected={handleDeleteSelected}
          />

          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
            onClick={handleAddNewProduct}
          >
            <AddIcon />
          </Fab>
        </>
      )}
    </PageContainer>
  );
};

export default ProductPage;
