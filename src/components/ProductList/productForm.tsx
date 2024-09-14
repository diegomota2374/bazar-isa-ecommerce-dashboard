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
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

interface ProductFormProps {
  onCancel: () => void;
}

interface FormValues {
  name: string;
  category: string;
  price: number;
  discount?: number;
  status: string;
  state: string;
  imgProduct: FileList;
}

const ProductForm: React.FC<ProductFormProps> = ({ onCancel }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      discount: 0,
      status: "available",
      state: "new",
      imgProduct: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("form data: ", data);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5">Novo Produto</Typography>
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
        name="category"
        control={control}
        rules={{ required: "Categoria é obrigatória" }}
        render={({ field }) => (
          <TextField
            label="Categoria"
            variant="outlined"
            size="small"
            fullWidth
            {...field}
            error={!!errors.category}
            helperText={errors.category ? errors.category.message : ""}
          />
        )}
      />

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
              value={field.value || "available"}
              error={!!errors.status}
            >
              <MenuItem value="available">Disponível</MenuItem>
              <MenuItem value="reserved">Reservado</MenuItem>
              <MenuItem value="sold">Vendido</MenuItem>
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
              value={field.value || "new"}
              error={!!errors.status}
            >
              <MenuItem value="new">Novo</MenuItem>
              <MenuItem value="semi-new">Semi Novo</MenuItem>
              <MenuItem value="little-used">Pouco Usado</MenuItem>
              <MenuItem value="with-malfunction">Com Avaria</MenuItem>
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files)}
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
            {field.value && field.value[0] && (
              <Typography variant="body2" color={"textSecondary"}>
                {field.value[0].name}
              </Typography>
            )}
          </Box>
        )}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Salvar
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
