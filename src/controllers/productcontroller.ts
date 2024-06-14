/*import { Request, Response } from 'express';
import Product from '../models/productModel';
import Review from '../models/reviewModel';
import Tag from '../models/categoryModel'*/
// import authenticateUser from '../middleware/authMiddleware';

//products-adminside-dup
/*export const createProduct=async(req:Request,res:Response)=>{
  try{
    const {name,description,price,tags}=req.body;

    // Find the categories (tags) based on the provided IDs
    const Tags = await Category.find({ _id: { $in: tags } }).select('name');
    
    // If no tags are found, return error response
    if (Tags.length === 0) {
      return res.status(404).json({ error: 'Categories not found' });
    }
    // Extract tag details (name and description)
    const tagDetails = Tags.map(tag => ({  name: tag.name })); // Generate UUID for tag _id
    
    // Create a new post document with tag details
    const newProduct = new Product({ name,description,price, tags: tagDetails });// Generate UUID for post _id
    
    // Save the new post to the database
    await newProduct.save();

    // Return success response
    return res.status(201).json({ message: 'Product created successfully', post: newProduct });
}catch (error) {
  console.error('Error creating post:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
};
*/
/*
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//userside
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({productId},{_id:0});
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Search for products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const  keyword  = req.query.keyword;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Invalid keyword' });
    }
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//adminside
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      category,
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//admin
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findOne({productId},{_id:0});
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//category

//category section
// Route to handle adding a new category or tag
export const addTag = async (req: Request, res: Response) => {
  try {
    const { name} = req.body;

    // Check if the category already exists
    const existingTag= await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Generate UUID
    // const _id = uuidv4();

    // Create a new category document
    const newTag = new Tag({name});

    // Save the new category to the database
    await newTag.save();

    // Return success response
    return res.status(201).json({ message: 'Category added successfully', category: newTag });
  } catch (error) {
    console.error('Error adding category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Route to retrieve all available categories
export const getTags= async (req: Request, res: Response) => {
  try {
    // Find all categories
    const Tags = await Tag.find();

    // Return the list of categories
    return res.status(200).json(Tags);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//review and comment
//add review-user
export const addReview=async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      const { rating, comment,userId } = req.body;
      // const userId = req.body;
  
      // Check if user has already reviewed the product
      const existingReview = await Review.findOne({ productId, userId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product', review: existingReview });
      }
  
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Create new review
      const newReview = new Review({
        productId,
        userId,
        rating,
        comment,
      });
  
      // Save the review to the database
      await newReview.save();
  
      res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //get review by productID
  export const getReviewsByProductId = async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
  
      // Check if product exists
      const product = await Product.findById(productId, { _id: 0 });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Retrieve all reviews for the product
      const reviews = await Review.find({ productId: productId }, { _id: 0 });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //update review
  export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId;
        const { rating, comment } = req.body;

        // Get the user ID from the request headers or parameters
        const userIdFromRequest = req.headers.userid || req.params.userid;

        // Check if the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is authorized to update the review
        if (review.userId !== userIdFromRequest) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the review
        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//deletereview
export const deleteReview = async (req: Request, res: Response) => {
  try {
      const reviewId = req.params.reviewId;

      // Get the user ID from the request headers or parameters
      const userIdFromRequest = req.headers.userid || req.params.userid;

      // Check if the review exists
      const review = await Review.findById(reviewId);
      if (!review) {
          return res.status(404).json({ message: 'Review not found' });
      }

      // Check if the user is authorized to delete the review
      if (review.userId !== userIdFromRequest) {
          return res.status(403).json({ message: 'Unauthorized' });
      }

      // Delete the review
      await Review.deleteOne({ _id: reviewId });

      res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
*/