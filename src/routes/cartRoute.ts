import express from 'express';
import type {Request, Response} from 'express';
import { getActiveCartForUser } from '../services/cartService.js';
import validateJWT from '../middlewares/validateJWT.js';

const router = express.Router();

interface UserRequest extends Request {
    user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
}

router.get('/', validateJWT, async (req, res) => {
    const userReq = req as UserRequest;
    const userId = userReq.user._id;
    const cart = await getActiveCartForUser({userId});
    res.status(200).send(cart);
});

export default router;