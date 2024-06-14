import { Request,Response } from "express";
import mongoose,{ Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { v4 as uuidv4} from 'uuid';
import User,{UserDocument} from "../models/userModel";
import Order from "../models/orderModel";
import  Review  from "../models/reviewModel";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Login from "../models/loginModel";
import Favorite from "../models/favoriteModel";
import Cart from '../models/cartModel';

// Secret key for JWT token
const JWT_SECRET =process.env.SECRET_KEY!;
// User registration controller
export const registerUser = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate UUID
      //  const userId = uuidv4();

       // Create a new user with UUID
       const newUser = new User({ username, email, password: hashedPassword });
       await newUser.save();

  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'validation failed' });
    }
  };
  
  // User authentication controller
  export const loginUser = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Issue a JWT token
      const token = jwt.sign({ userId: user._id,role:user.role },JWT_SECRET);
      
      const loginUser=new Login({
        username:username,
        password:isPasswordValid,
        token:token,
      });

      const LoginData=await loginUser.save();
      return res.status(200).json({ message:LoginData});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.username = username;
    user.email = email;
    user.password = password; // You might want to hash the password before saving
    // Hash the password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user profile
    const updatedUser = await user.save();

    res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Search for products
export const searchProduct = async (req: Request, res: Response) => {
  try {
      const { productName } = req.query;

      // Check if productName is a string
      if (typeof productName !== 'string') {
        return res.status(400).json({ message: 'Invalid product name' });
    }

      // Step 1: Search for products by name
      const products = await Product.find({ name: { $regex: new RegExp(productName, 'i') } });

      if (!products || products.length === 0) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Step 2: Retrieve product IDs
      const productIds = products.map(product => product._id);
      console.log('Product IDs:', productIds); // Debug log


      // Step 3: Query categories collection to find categories containing the retrieved product IDs
      const categories = await Category.find({ 'products.productId': { $in: productIds } });
      console.log('Categories:', categories); // Debug log

      res.status(200).json({ products, categories });
  } catch (error) {
      console.error('Error searching product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

//get products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find()
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Controller to get products belonging to a specific category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
      const categoryId = req.params.categoryId;
      const productsInCategory = await Product.find({ categories: categoryId });
      res.status(200).json({ products: productsInCategory });
  } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get categories to which a specific product belongs
export const getCategoriesByProduct = async (req: Request, res: Response) => {
  try {
      const productId = req.params.productId;
      const categoriesForProduct = await Category.find({ 'products.productId': productId });
      res.status(200).json({ categories: categoriesForProduct });
  } catch (error) {
      console.error('Error fetching categories by product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
//products added to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
      const { productId, userId } = req.body;

      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Find or create the cart for the user
      let cart = await Cart.findOne({ userId });
      if (!cart) {
          cart = new Cart({ userId, items: [], grandTotal: 0 });
      }

      // Check if the product already exists in the cart
      const existingItem = cart.items.find(item => item.productId === productId);
      if (existingItem) {
          // If the product already exists in the cart, increase its quantity
          existingItem.quantity++;
      } else {
        // If the product is not in the cart, add it with details
        cart.items.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            total:product.price
        });
    }
      // Calculate the total price of the added product
      const totalPrice = product.price * (existingItem?.quantity || 1); // Use existing quantity if it exists

      // Update the grand total of the cart
      cart.grandTotal += totalPrice;

      // Save the cart to the database
      await cart.save();

      res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
//view cart
export const viewCart = async (req: Request, res: Response) => {
  try {
      const { userId } = req.body;

      // Find the cart for the user
      const cart = await Cart.findOne({ userId });
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found for this user' });
      }

      // Check if items array is empty
      if (cart.items.length === 0) {
          return res.status(404).json({ message: 'Cart is empty' });
      }

      res.status(200).json({ message: 'Cart retrieved successfully', cart });
  } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

//increase quantity
// Define an interface for the request parameters
interface RequestParams {
  
    userId:string;
    productId:Types.ObjectId;

}
export const increaseQuantity = async (req: Request, res: Response) => {
  try {

     // Log the entire req.params object
    console.log('Request params:', req.params);

      const { productId, userId } = req.params;

      // Log the received userId and productId
      console.log('Received userId:', userId);
      console.log('Received productId:', productId);

      // Find the cart for the user
      let cart = await Cart.findOne({ userId });
      if (!cart) {
          console.log('Cart not found for userId:', userId);
          return res.status(404).json({ message: 'Cart not found' });
      }

      // Log the items in the cart
      console.log('Items in cart:', cart.items);

      // Convert the received productId to ObjectId
      const formattedProductId = new Types.ObjectId(productId);

      // Find the existing item in the cart
      const existingItem = cart.items.find(item => item.productId.toString() === formattedProductId.toString());      if (!existingItem) {
          console.log('Product not found in cart for productId:', productId);
          return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Increase the quantity of the product in the cart
      existingItem.quantity++;

      // Find the product by ID to calculate the total price
      const product = await Product.findById(productId);
      if (!product) {
          console.log('Product not found in database for productId:', productId);
          return res.status(404).json({ message: 'Product not found' });
      }

      // Update the grand total of the cart
      cart.grandTotal += product.price;

      // Calculate the total for each item in the cart
    let totalForItem = existingItem.quantity * product.price;

    // Update the total for the existing item
    existingItem.total = totalForItem;


      // Save the cart to the database
      await cart.save();

       // Calculate the grand total by summing up the totals of all items in the cart
    let grandTotal = 0;
    cart.items.forEach(item => {
      grandTotal += item.total || 0;
    });

      res.status(200).json({ message: 'Quantity increased successfully', cart });
  } catch (error) {
      console.error('Error increasing quantity:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
export const decreaseQuantity = async (req: Request, res: Response) => {
  try {
    // Log the entire req.params object
    console.log('Request params:', req.params);

    const { productId, userId } = req.params;

    // Log the received userId and productId
    console.log('Received userId:', userId);
    console.log('Received productId:', productId);

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log('Cart not found for userId:', userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Log the items in the cart
    console.log('Items in cart:', cart.items);

    // Convert the received productId to ObjectId
    const formattedProductId = new Types.ObjectId(productId);

    // Find the existing item in the cart
    const existingItem = cart.items.find(item => item.productId.toString() === formattedProductId.toString());
    if (!existingItem) {
      console.log('Product not found in cart for productId:', productId);
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Decrease the quantity of the product in the cart
    if (existingItem.quantity > 1) {
      existingItem.quantity--;

      // Find the product by ID to get its price
      const product = await Product.findById(productId);
      if (!product) {
        console.log('Product not found in database for productId:', productId);
        return res.status(404).json({ message: 'Product not found' });
      }

      // Update the grand total of the cart
      cart.grandTotal -= product.price;

      // Calculate the total for the existing item
      existingItem.total = existingItem.quantity * product.price;

      // Save the cart to the database
      await cart.save();

      // Calculate the grand total by summing up the totals of all items in the cart
      let grandTotal = 0;
      cart.items.forEach(item => {
        grandTotal += item.total || 0;
      });

      res.status(200).json({ message: 'Quantity decreased successfully', cart });
    } else {
      res.status(400).json({ message: 'Quantity cannot be decreased further' });
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//delete item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.params;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Convert the received productId to ObjectId
    const formattedProductId = new Types.ObjectId(productId);

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === formattedProductId.toString());

    // If item not found in cart, return error
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Get the removed item details
    const removedItem = cart.items[itemIndex];

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Update the grand total of the cart
    cart.grandTotal -= removedItem.total;

    // Save the updated cart to the database
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//place order
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, products, status } = req.body;

    let totalPrice = 0;
    let orderProducts: { productId: string; productName: string; quantity: number; price: number }[] = [];
    if (products && products.length > 0) {
      // Calculate the total price for each product and sum them up to get the overall total
      totalPrice = products.reduce((total: number, product: any) => {
        const productTotal = product.price * product.quantity;
        orderProducts.push({
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price
        });
        return total + productTotal;
      }, 0);
    } else {
      // Find the user's cart
      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      totalPrice = cart.grandTotal;
      orderProducts = cart.items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // Clear the user's cart or update the cart status as needed
      await Cart.findOneAndUpdate({ userId }, { items: [], grandTotal: 0 });
    }

    // Create the order object with calculated total
    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalPrice,
      status
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User controller function to get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
      const orders = await Order.find({ userId: req.params.userId }).populate('products');

      res.status(200).json({ orders });
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
//cancel order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId);

    // If order not found, return 404
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check if order status is already "Cancelled"
    if (order.status === 'Cancelled') {
      res.status(400).json({ error: 'Order is already cancelled' });
      return;
    }

    // Update order status to "Cancelled"
    order.status = 'Cancelled';
    await order.save();

    // Return success response
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//addreview

// Controller to add a review
export const addReview = async (req: Request, res: Response)=> {
  try {
    const { userId, productId, rating, comment } = req.body;
    
    // Fetch user details to get username
    const user: UserDocument | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    
    // Create a new review document
    const newReview = new Review({ userId,userName: user.username, productId, rating, comment });

    // Save the new review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get comments for a specific product
export const getProductComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId;

    // Find all reviews for the given product
    const comments = await Review.find({ productId });

    if (comments.length === 0) {
      res.status(200).json({ message: 'No comments for this product' });
    } else {
      res.status(200).json({ comments });
    }
  } catch (error) {
    console.error('Error getting product comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to add a product to favorites
export const addFavorite = async (req: Request, res: Response)=> {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Check if the product is already in favorites
    const existingFavorite = await Favorite.findOne({ userId, product: productId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    // Create a new favorite
    const newFavorite = new Favorite({ userId, product: productId });
    await newFavorite.save();

    // Populate product details
    const populatedFavorite = await Favorite.findById(newFavorite._id).populate('product');
    if (!populatedFavorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(201).json({ message: 'Product added to favorites', favorite: populatedFavorite });
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller function to remove a product from favorites
export const removeFavorite = async (req: Request, res: Response)=> {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find and delete the favorite
    const deletedFavorite = await Favorite.findOneAndDelete({ userId, product: productId });
    if (!deletedFavorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Product removed from favorites', favorite: deletedFavorite });
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller function to get favorite products for a user
export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Find favorites for the user and populate product details
    const favorites = await Favorite.find({ userId }).populate('product');
    res.status(200).json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
