import express from 'express';
import { login, register } from '../services/userService.js';

const router = express.Router();

router.post ('/register', async (req, res) => {
try {

    const { firstName, lastName, email, password } = req.body;
    const {data, status} = await register({firstName, lastName, email, password})
    res.status(status).json(data);
}

    catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.get('/login', async (req, res) => {
try {

    const { email, password } = req.body;
    const {data, status} = await login({email, password})
    res.status(status).json(data);
}

    catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

export default router;
