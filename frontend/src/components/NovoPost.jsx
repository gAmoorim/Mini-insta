import React, { useState } from "react";
import { TextField, Button, Box, Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api"; // Importa a API configurada

const NovoPost = ({ onPostCriado }) => {
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
  };

  const handlePostar = async (e) => {
    e.preventDefault();

    // Validação: texto ou imagem é obrigatório
    if (!texto.trim() && !imagem) {
      toast.error("Digite algo ou envie uma imagem.");
      return;
    }

    // Cria o FormData e adiciona os campos
    const formData = new FormData();
    formData.append("fotos", imagem);  // Envie apenas "fotos", não "imagem"    

    // Exibe o conteúdo do FormData no console (para debug)
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setLoading(true);

    try {
      // Faz a requisição POST para o backend
      const response = await api.post("/postagens", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Exibe mensagem de sucesso e limpa o formulário
      toast.success("Post criado com sucesso!");
      setTexto("");
      setImagem(null);

      // Chama a função para atualizar o feed de postagens
      if (onPostCriado) onPostCriado();
    } catch (error) {
      // Exibe o erro completo no console
      console.error("Erro ao criar post:", error);

      // Exibe mensagem de erro para o usuário
      toast.error("Erro ao criar post. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={handlePostar}
          display="flex"
          flexDirection="column"
        >
          <TextField
            label="O que você está pensando?"
            multiline
            rows={2}
            fullWidth
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            sx={{ mb: 2 }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            style={{ marginBottom: "16px" }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NovoPost;