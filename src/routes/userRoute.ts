import express from 'express';
import { login, register } from '../services/userService.js';

const router = express.Router();

router.post ('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const {data, status} = await register({firstName, lastName, email, password})
    res.status(status).json(data);
});

router.get('/login', async (req, res) => {
    const { email, password } = req.body;
    const {data, status} = await login({email, password})
    res.status(status).json(data);
});

export default router;
