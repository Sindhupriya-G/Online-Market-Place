import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    total:number;
}


// Define the interface for the Cart document
interface ICart extends Document {
    userId: string;
    items: ICartItem[];
    grandTotal: number;
}

// Define the schema for the Cart model
const cartSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        total: {
            type: Number,
            required: true
          }
    }],
    grandTotal: {
        type: Number,
        required: true,
        default: 0
    }
});

// Define the Cart model
export default mongoose.model<ICart>('Cart', cartSchema);
