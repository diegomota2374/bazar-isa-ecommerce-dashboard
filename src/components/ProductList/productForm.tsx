import { bazaarCategory } from "@/mocks/Products";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";

interface FormValues {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount?: number;
  status: string;
  state: string;
  imgProduct: FileList;
}
interface ProductFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  editingProduct?: FormValues | null;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onCancel,
  onSuccess,
  editingProduct,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: editingProduct?.name || "",
      category: editingProduct?.category || bazaarCategory[0],
      description: editingProduct?.description || "",
      price: editingProduct?.price || 0,
      discount: editingProduct?.discount || 0,
      status: editingProduct?.status || "Disponível",
      state: editingProduct?.state || "Novo",
      imgProduct: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const urlApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (editingProduct && editingProduct.imgProduct) {
      setImagePreview(editingProduct.imgProduct as unknown as string);
    }
  }, [editingProduct]);

  //Função para lidar com a pré-visualização da imagem
  const handleImageUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview(null);
    }
  };

  // Função para enviaar dados para a API usando Axios
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      //Adiciona os dados do produto ao FormData
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount?.toString() || "0");
      formData.append("status", data.status);
      formData.append("state", data.state);

      //Adiciona a imagem ao FormData (se existir)
      if (data.imgProduct && data.imgProduct[0]) {
        formData.append("imgProduct", data.imgProduct[0]);
      }

      if (editingProduct) {
        await axios.put(`${urlApi}/products/${editingProduct._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("editado com sucesso");
      } else {
        //Envia os dados para a API
        await axios.post(`${urlApi}/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5">
        {editingProduct ? "Editar Produto" : "Novo Produto"}
      </Typography>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Nome do produto é obrigatório" }}
        render={({ field }) => (
          <TextField
            label="Nome do Produto"
            variant="outlined"
            size="small"
            fullWidth
            {...field}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ""}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: "Descrição é obrigatória" }}
        render={({ field }) => (
          <TextField
            label="Descrição"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={2}
            {...field}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
          />
        )}
      />

      <FormControl fullWidth>
        <InputLabel>Categoria</InputLabel>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Categoria"
              size="small"
              onChange={(event: SelectChangeEvent<string>) =>
                field.onChange(event.target.value)
              }
              value={field.value || bazaarCategory[0]}
              error={!!errors.status}
            >
              {bazaarCategory.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.status && (
          <Typography color="error">{errors.status.message}</Typography>
        )}
      </FormControl>

      <Controller
        name="price"
        control={control}
        rules={{
          required: "Preço é obrigatório",
          min: { value: 0, message: "Preço deve ser maior ou igual a 0" },
        }}
        render={({ field }) => (
          <TextField
            label="Preço"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            {...field}
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ""}
          />
        )}
      />

      <Controller
        name="discount"
        control={control}
        rules={{
          min: { value: 0, message: "Desconto deve ser maior ou igual a 0" },
        }}
        render={({ field }) => (
          <TextField
            label="Desconto"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            {...field}
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ""}
          />
        )}
      />

      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Status"
              size="small"
              onChange={(event: SelectChangeEvent<string>) =>
                field.onChange(event.target.value)
              }
              value={field.value || "Disponível"}
              error={!!errors.status}
            >
              <MenuItem value="Disponível">Disponível</MenuItem>
              <MenuItem value="Reservado">Reservado</MenuItem>
              <MenuItem value="Vendido">Vendido</MenuItem>
            </Select>
          )}
        />
        {errors.status && (
          <Typography color="error">{errors.status.message}</Typography>
        )}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Estado</InputLabel>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Estado"
              size="small"
              onChange={(event: SelectChangeEvent<string>) =>
                field.onChange(event.target.value)
              }
              value={field.value || "Novo"}
              error={!!errors.status}
            >
              <MenuItem value="Novo">Novo</MenuItem>
              <MenuItem value="Semi Novo">Semi Novo</MenuItem>
              <MenuItem value="Pouco Usado">Pouco Usado</MenuItem>
              <MenuItem value="Com Avaria">Com Avaria</MenuItem>
            </Select>
          )}
        />
        {errors.status && (
          <Typography color="error">{errors.status.message}</Typography>
        )}
      </FormControl>

      <Controller
        name="imgProduct"
        control={control}
        render={({ field }) => (
          <Box sx={{ marginTop: 2 }}>
            {!imagePreview ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    handleImageUpload(e.target.files);
                  }}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    color="primary"
                    fullWidth
                  >
                    Selecionar Imagem
                  </Button>
                </label>
              </>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={imagePreview}
                  alt="Pré-visualização"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setImagePreview(null);
                    field.onChange(null); // Reseta o campo do arquivo
                  }}
                  sx={{ mt: 2 }}
                >
                  Remover Imagem
                </Button>
              </Box>
            )}
          </Box>
        )}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
