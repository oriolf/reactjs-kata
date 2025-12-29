import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Layout from "../Layout";
import { useHttp } from "../hooks/useHttp";
import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const { login } = useAuth();
  const { get, post } = useHttp();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const res = await post<{ ok: boolean }>("api/login", {
      email: data.get("email"),
      password: data.get("password"),
    });
    if (res && res.ok) {
      const me = await get<any>("api/me");
      login(me);
    }
  };

  const translateMsg = "Inicia sessió";
  return (
    <Layout title={translateMsg}>
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
            {translateMsg}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correu electrònic"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contrasenya"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {translateMsg}
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};
