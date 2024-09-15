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

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const urlApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Função apra buscar produtos da API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${urlApi}/products`);
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
  };

  return (
    <PageContainer
      title="Lista de Produtos"
      description="Esta página manipula os produtos"
    >
      <DashboardCard>
        {showForm ? (
          <ProductForm
            onCancel={() => setShowForm(false)}
            onSuccess={onSuccess}
          />
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
                <Alert
                  onClose={() => setSuccessMessage(null)}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {successMessage}
                </Alert>
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
            <ProductList rows={filteredRows} />
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
              }}
              onClick={() => setShowForm(true)}
            >
              <AddIcon />
            </Fab>
          </>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ProductPage;
