const express = require('express');
const prisma = require('../lib/prisma');
 
const router = express.Router();
 
router.param('id', (req, res, next, id) => {
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ erro: 'O id precisa ser um número inteiro' });
  }
  next();
});
 
async function buscarInstrutor(id) {
  if (!Number.isInteger(id)) return null;
  return prisma.instrutor.findUnique({ where: { id } });
}
 
router.post('/', async (req, res) => {
  const { titulo, descricao, instrutor_id } = req.body || {};
 
  if (!titulo || !descricao || !instrutor_id) {
    return res.status(400).json({ erro: 'Título, descrição e instrutor_id são obrigatórios' });
  }
 
  const instrutor = await buscarInstrutor(Number(instrutor_id));
 
  if (!instrutor) {
    return res.status(404).json({ erro: 'Instrutor não encontrado' });
  }
 
  const curso = await prisma.curso.create({
    data: { titulo, descricao, instrutor_id: instrutor.id },
    include: { instrutor: true },
  });
 
  res.status(201).json(curso);
});
 
router.get('/', async (req, res) => {
  const cursos = await prisma.curso.findMany({
    include: { instrutor: true },
  });
 
  res.json(cursos);
});
 
router.get('/:id', async (req, res) => {
  const curso = await prisma.curso.findUnique({
    where: { id: Number(req.params.id) },
    include: { instrutor: true },
  });
 
  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }
 
  res.json(curso);
});
 
router.put('/:id', async (req, res) => {
  const { titulo, descricao, instrutor_id } = req.body || {};
 
  if (!titulo || !descricao || !instrutor_id) {
    return res.status(400).json({ erro: 'Título, descrição e instrutor_id são obrigatórios' });
  }
 
  const instrutor = await buscarInstrutor(Number(instrutor_id));
 
  if (!instrutor) {
    return res.status(404).json({ erro: 'Instrutor não encontrado' });
  }
 
  try {
    const curso = await prisma.curso.update({
      where: { id: Number(req.params.id) },
      data: { titulo, descricao, instrutor_id: instrutor.id },
      include: { instrutor: true },
    });
 
    res.json(curso);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    throw error;
  }
});
 
router.delete('/:id', async (req, res) => {
  try {
    await prisma.curso.delete({
      where: { id: Number(req.params.id) },
    });
 
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    throw error;
  }
});
 
module.exports = router;