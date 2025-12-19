import mongoose, {Document, Schema, type ObjectId} from 'mongoose';

export interface IOrderItem {   // independent from the cart --> !product: IProduct --> product: string

    productTitle: string;
    productImage: string;
    unitPrice: number;
    quantity: number;

}

export interface IOrder extends Document {

    orderItems: IOrderItem[];
    total: number;
    address: string;    // we didn't use object to add the details like building, street, city, country etc --> to keep it simple
    userId: ObjectId | string;

}

const orderItemsSchema = new Schema<IOrderItem>({
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
    orderItems: [orderItemsSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
})

export const orderModel = mongoose.model<IOrder>('Order', orderSchema, 'orders');