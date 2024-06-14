import express, { Request,Response} from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Order from "../models/orderModel";
import  Review  from "../models/reviewModel";
import Admin from "../models/adminModel";
import User from "../models/userModel";
import multer from "multer";
import path from "path";
// import  ObjectId from 'mongoose';

//promote to Admin
export const promoteToAdmin = async (req: Request,  res: Response) => {
  try {

    const {userId} = req.params;
    // Find the user by their ID
    const user = await User.findById({_id:userId});

    console.log(user);


    
    if (!user) {
      throw new Error("User not found");
    }


    if(user.role=="admin")
      {
         return res.status(201).json({"message":"You are already a admin"})
      }
    else{
        // Update the user's role to admin
              user.role = "admin";
              await user.save();

        // Create a new document in the admin collection
              const admin = new Admin({
                _id: user._id,
                username: user.username,
                password:user.password,
                email: user.email,
                role: user.role,
          });
                await admin.save();
                return res.status(200).json({ message:"Successfully promoted to admin", admin });
         }

  } catch (error: any) {
    return res.status(201).json({message:"Failed to promote user to admin"})
  }
};

//upload image
const storage = multer.diskStorage({
  destination: (req, file,cb) =>{
      cb(null, 'public/images')
  },

  filename :(req,file , cb)=>{
    cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
})



// Initialize multer middleware
export const upload = multer({
  storage: storage
});

//get all users
export const getAllUsers=async (req:Request,res:Response):Promise<void>=>{
  try{
    const users=await User.find();
    res.status(200).json(users);
  }catch(error){
    console.error('Error fetching users:',error);
    res.status(500).json({message:'Internal server error'})
  }
}

//create category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create a new category with the provided name
        const newCategory = new Category({ name });

        // Save the category to the database
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//add product
  export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, categories, image } = req.body;

        // Check if the product already exists by name
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        // Create a new product with the provided data
        const newProduct = new Product({
            name,
            description,
            price,
            categories,
            image
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//add product to category
  export const addProductToCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId} = req.params;
        const { productId }=req.body;

        // Find the category by ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Find the product by ID
        const product = await Product.findById(productId).populate('categories');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Add the product to the category's products array with additional information
        category.products.push({
            productId,
            productInfo: {
                name: product.name,
                price: product.price,
                image: product.image
            }
        });     
        // Save the category with the updated products array
        await category.save();   
        res.status(200).json({ message: 'Product added to category successfully' });
    } catch (error) {
        console.error('Error adding product to category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//remove product from category
export const removeProductFromCategory = async (req: Request, res: Response) => {
  try {
      const { categoryId, productId } = req.params;

      // Find the category by ID
      const category = await Category.findById(categoryId);
      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Remove the product from the category's products array
      const index = category.products.findIndex(product => product.productId.toString() === productId);
      if (index !== -1) {
          category.products.splice(index, 1);
          await category.save();
      }

      res.status(200).json({ message: 'Product removed from category successfully' });
  } catch (error) {
      console.error('Error removing product from category:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  //display products
 export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find()
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//update products
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.productId;
      const { name, description, price, category} = req.body;
  
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, { name, description, price, category }, { new: true });
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  //delete product
  export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId: string = req.params.productId;
  
      // Find the product by ID and delete it
      const deletedProduct= await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
         res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Admin controller function to get all orders
export const getAllOrderss = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find();

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Admin controller function to update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        // Find the order by ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Admin controller to delete an order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID and delete it
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller to get all reviews
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all reviews from the database
    const reviews = await Review.find();

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller to delete a particular user comment
export const deleteUserReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewId = req.params.reviewId;

    // Find the comment by ID and delete it
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller function for calculating average rating
export const calculateAverageRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId;
    // Find reviews for the product
    console.log('Product ID:', productId);

    // Find reviews for the product
    const reviews = await Review.find({ productId });
 // Log reviews to check if they are fetched correctly
 console.log('Reviews:', reviews);

    // Calculate average rating
    let totalRating = 0;
    for (const review of reviews) {
      totalRating += review.rating;
    }
    console.log('Total Rating:', totalRating);
    console.log('Number of Reviews:', reviews.length);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller function for calculating total sales and revenue for a specific product
export const calculateSalesRevenue = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // Find orders containing the specified product
    const orders = await Order.find({ 'products.productId': productId });

    let totalSales = 0;
    let totalRevenue = 0;

    // Calculate total sales and revenue
    for (const order of orders) {
      for (const product of order.products) {
        if (String(product.productId) === productId) {
          totalSales += product.quantity;
          totalRevenue += product.quantity * product.price;
        }
      }
    }

    res.status(200).json({ totalSales, totalRevenue });
  } catch (error) {
    console.error('Error calculating sales and revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
/*export const BestSellingProducts = async (req: Request, res: Response) => {
  const startDate = String(req.query.startDate); // Explicitly cast to string
  const endDate = String(req.query.endDate); // Explicitly cast to string
  
  try {
    // Finding orders within the specified date range
    const orders = await Order.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Counting product quantities
    const productQuantities: { [productId: string]: number } = {}; // Specify type annotation for productQuantities
    for (const order of orders) {
      for (const product of order.products) {
        const productIdString = String(product.productId); // Explicitly convert ObjectId to string
        if (!productQuantities[productIdString]) {
          productQuantities[productIdString] = 0;
        }
        productQuantities[productIdString] += product.quantity;
      }
    }

    // Sorting products based on quantity sold
    const bestSellingProducts = Object.keys(productQuantities)
      .sort((a, b) => productQuantities[b] - productQuantities[a]);

    // Sending the response
    res.status(200).json({ bestSellingProducts });
  } catch (error) {
    console.error('Error identifying best-selling products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};*/
export const BestSellingProducts = async (req: Request, res: Response) => {
  try {
    // Get the year and month from the query parameters
    const year = Number(req.query.year); // Assuming year is passed in query params
    const month = Number(req.query.month); // Assuming month is passed in query params

    // Validate the year and month inputs
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Set the startDate to the beginning of the specified month
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    // Set the endDate to the end of the specified month
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    // Finding orders within the specified date range
    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // Counting product quantities
    const productQuantities: { [productId: string]: number } = {};
    for (const order of orders) {
      for (const product of order.products) {
        const productIdString = String(product.productId);
        if (!productQuantities[productIdString]) {
          productQuantities[productIdString] = 0;
        }
        productQuantities[productIdString] += product.quantity;
      }
    }

    // Sorting products based on quantity sold
    const bestSellingProducts = Object.keys(productQuantities)
      .sort((a, b) => productQuantities[b] - productQuantities[a]);

    // Sending the response
    res.status(200).json({ bestSellingProducts });
  } catch (error) {
    console.error('Error identifying best-selling products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//upload image
export  const uploadImage= async(req:Request,res:Response)=>{
  
    // console.log(req.body);
    // return res.send(req.file)
    return res.json({"imageUrl":req.file?.path})
       
}
