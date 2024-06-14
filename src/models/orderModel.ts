/*import { Schema, model, Document } from 'mongoose';

export interface Order extends Document {
  userId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  status: string; // New field for order status
}

const orderSchema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
});

export default model<Order>('Order', orderSchema);
*/

import { Schema, model, Document } from 'mongoose';

// Define the interface for an individual product in an order
interface OrderProduct {
  productId: Schema.Types.ObjectId;
  productName:string;
  quantity:number;
  price: number;
}

// Define the interface for the Order document
export interface Order extends Document {
  userId: Schema.Types.ObjectId;
  products: OrderProduct[]; // Array of OrderProduct objects
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered'|'Cancelled';
  date:Date;
}
// Define the schema for the Order model
const orderSchema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: String,
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Cancelled'], default: 'Pending' },
  date:{type:Date,default:Date.now}
});

export default model<Order>('Order', orderSchema);
