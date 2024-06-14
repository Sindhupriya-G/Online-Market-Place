/*import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Tag extends Document {
  tagId:string;
  name: string;
}

const tagsSchema: Schema = new Schema({
  tagId: { type: String, default: uuidv4,unique:true },
  name: { type: String, required: true }
});

export default mongoose.model<Tag>('Tag', tagsSchema);
*/

import mongoose, { Document, Schema } from 'mongoose';

// Define a sub-document schema for each product
interface IProductInfo {
    name: string;
    price: number;
    image:string
}
// Define the main category schema

export interface ICategory extends Document {
  name: string;
  products: { productId: string; productInfo: IProductInfo }[]; // Array of product objects
}

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        productInfo: {
          name: String,
          price: Number,
          image: String
        },
    }]
});

export default mongoose.model<ICategory>('Category', categorySchema);
