import express from 'express';
import type {Request, Response} from 'express';
import { addItemToCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from '../services/cartService.js';
import validateJWT from '../middlewares/validateJWT.js';
import { type ExtendRequest } from "../types/extendedRequest.js";

const router = express.Router();

// interface UserRequest extends Request {
//     user: {
//         _id: string;
//         email: string;
//         firstName: string;
//         lastName: string;
//     }
// }

router.get('/', validateJWT, async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({userId});
    res.status(200).send(cart);
});

router.post ('/items', validateJWT, async (req: ExtendRequest, res: Response) => {
    const userId = req.user._id;
    //const body = req.body;
    const { productId, quantity } = req.body; // Destructuring assignment

    const response = await addItemToCart({userId, productId, quantity});
    res.status(response.statusCode).send(response.data);
});

router.put ('/items', validateJWT, async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id; // Optional chaining to ensure user exists
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({userId, productId, quantity});
    res.status(response.statusCode).send(response.data);
});

router.delete ('/items/:productId', validateJWT, async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const {productId} = req.params;
    const response = await deleteItemInCart({userId, productId});
    res.status(response.statusCode).send(response.data);
});

export default router;