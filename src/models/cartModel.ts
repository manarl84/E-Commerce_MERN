import mongoose, {Document, Schema, type ObjectId} from 'mongoose';
import type { IProduct } from './productModel.js';


const cartStatusEnum = ['active', 'completed', 'cancelled']

export interface ICartItem extends Document {
    product: IProduct;
    unitPrice: number;
    quantity: number;
}

// Suggested by Copilot
/* export interface ICart {
    products: { productId: mongoose.Types.ObjectId; quantity: number }[];
    createdAt?: Date;
    updatedAt?: Date;
} */

export interface ICart extends Document {
    userId: ObjectId | string; // ObjectId is mongoose type, string is for easier handling in services
    items: ICartItem[];
    totalAmount: number;
    status: 'active' | 'completed' | 'cancelled'; // Only one active cart per user is allowed
    createdAt?: Date;
    updatedAt?: Date;
}

// cartItemSchema will not be used in Services / Routes --> It's required only in the DB
const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Product has to be exactly the same as the model name 'Product' in mongoose.model<IProduct>('Product', productSchema, "products");
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
} //, { _id: false }
);


const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: cartStatusEnum , default: 'active' },
}, {
    timestamps: true
});

export const cartModel = mongoose.model<ICart>('Cart', cartSchema, 'carts');