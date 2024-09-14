import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Alert,
} from "@mui/material";
import api from "@/utils/axiosConfig";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chame sua API de login
    try {
      const response = await api.post(`/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        // Armazena o token no localStorage
        localStorage.setItem("token", token);
        // Exibe mensagem de sucesso
        setSuccessMessage("Login bem-sucedido!");
        setErrorMessage(null); // Limpa a mensagem de erro, se houver
        // Redireciona para o dashboard após o login bem-sucedido
        setTimeout(() => {}, 1500); // Redireciona após 1,5s
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setSuccessMessage(null); // Limpa a mensagem de sucesso, se houver
      setErrorMessage("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthLogin;
