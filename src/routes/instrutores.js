const express = require('express');

const prisma = require('../lib/prisma');
 
const router = express.Router();
 
// roda antes de qualquer rota que tenha :id

router.param('id', (req, res, next, id) => {

  if (!Number.isInteger(Number(id))) {

    return res.status(400).json({ erro: 'O id precisa ser um número inteiro' });

  }

  next();

});
 
router.post('/', async (req, res) => {

  const { nome, email } = req.body || {};
 
  if (!nome || !email) {

    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });

  }
 
  try {

    const instrutor = await prisma.instrutor.create({

      data: { nome, email },

    });
 
    res.status(201).json(instrutor);

  } catch (error) {

    if (error.code === 'P2002') {

      return res.status(409).json({ erro: 'Já existe um instrutor com esse email' });

    }

    throw error;

  }

});
 
router.get('/', async (req, res) => {

  const instrutores = await prisma.instrutor.findMany({

    include: { cursos: true },

  });
 
  res.json(instrutores);

});
 
router.get('/:id', async (req, res) => {

  const instrutor = await prisma.instrutor.findUnique({

    where: { id: Number(req.params.id) },

    include: { cursos: true },

  });
 
  if (!instrutor) {

    return res.status(404).json({ erro: 'Instrutor não encontrado' });

  }
 
  res.json(instrutor);

});
 
router.put('/:id', async (req, res) => {

  const { nome, email } = req.body || {};
 
  if (!nome || !email) {

    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });

  }
 
  try {

    const instrutor = await prisma.instrutor.update({

      where: { id: Number(req.params.id) },

      data: { nome, email },

    });
 
    res.json(instrutor);

  } catch (error) {

    if (error.code === 'P2025') {

      return res.status(404).json({ erro: 'Instrutor não encontrado' });

    }

    if (error.code === 'P2002') {

      return res.status(409).json({ erro: 'Esse email já está em uso' });

    }

    throw error;

  }

});
 
router.delete('/:id', async (req, res) => {

  try {

    await prisma.instrutor.delete({

      where: { id: Number(req.params.id) },

    });
 
    res.status(204).send();

  } catch (error) {

    if (error.code === 'P2025') {

      return res.status(404).json({ erro: 'Instrutor não encontrado' });

    }

    throw error;

  }

});
 
module.exports = router;
 