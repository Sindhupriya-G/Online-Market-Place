/*
import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Product extends Document {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const ProductSchema = new Schema<Product>({
  productId: { type: String, default: uuidv4, unique: true },  
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

export default mongoose.model<Product>('Product', ProductSchema);
*/
/*import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Product document
interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string[];
    image:string;  // Add image field to store the path or URL of the image
}

// Define the schema for the Product model
const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    image:{
        type:String,
        required:true
    }
});

// Define the Product model
export default mongoose.model<IProduct>('Product', productSchema);
*/

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Product document
interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    categories: Schema.Types.ObjectId[] | string[];    image: string;
}

// Define the schema for the Product model
const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    image: {
        type: String,
        required: true
    }
});

// Define the Product model
export default mongoose.model<IProduct>('Product', productSchema);
