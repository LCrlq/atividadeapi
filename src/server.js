const express = require('express');
const instrutoresRoutes = require('./routes/instrutores');
const cursosRoutes = require('./routes/cursos');
 
const app = express();
 
app.use(express.json());
 
app.use('/instrutores', instrutoresRoutes);
app.use('/cursos', cursosRoutes);
 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});