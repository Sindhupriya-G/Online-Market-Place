import express from "express";
import { registerUser,loginUser,getUserProfile,updateUserProfile,
    searchProduct,getAllProducts,getProductsByCategory,getCategoriesByProduct,addToCart,viewCart,removeFromCart,
    increaseQuantity,decreaseQuantity,
    placeOrder,getAllOrders,cancelOrder,addReview ,getProductComments,
    addFavorite,removeFavorite, getFavorites} from "../controllers/usercontroller";
import { promoteToAdmin,getAllUsers,createCategory,getAllCategories,deleteCategory,
    addProductToCategory,removeProductFromCategory,
    addProduct,getProducts,updateProduct,deleteProduct,getAllOrderss,updateOrderStatus,deleteOrder,
    getAllReviews,deleteUserReview,calculateAverageRating,calculateSalesRevenue,BestSellingProducts,
    uploadImage,upload} from "../controllers/admincontroller";
import { userValidation,adminRouteValidation } from "../middleware/middleware";

const route = express.Router();

//user
route.post('/register',registerUser);
route.post('/login',loginUser);
route.get('/getuser/:userId',userValidation,getUserProfile);
route.post('/updateprofile/:userId',userValidation,updateUserProfile)
//products
route.get('/products/search',userValidation,searchProduct);
route.get('/products',userValidation,getAllProducts);
// Route to get products belonging to a specific category
route.get('/categories/:categoryId/products',userValidation,getProductsByCategory);

// Route to get categories to which a specific product belongs
route.get('/products/:productId/categories',userValidation,getCategoriesByProduct);

// cart
route.post('/cart',userValidation,addToCart);
route.post('/viewcart',userValidation,viewCart);
// Route to increase the quantity of a product in the cart
route.post('/users/:userId/cart/:productId',userValidation,increaseQuantity);
//decrease quantity
route.post('/users/:userId/cart/:productId/decrease',userValidation,decreaseQuantity);
//removeitem from cart
route.delete('/removeFromCart/:userId/:productId',userValidation,removeFromCart);

//place order
route.post('/order',userValidation,placeOrder);
//get orders
route.get('/orders/:userId',userValidation,getAllOrders);
//cancel order
route.post('/orders/:orderId/cancel',userValidation,cancelOrder)
//review
route.post('/review',userValidation,addReview)
route.get('/getproductreview/:productId',userValidation,getProductComments)

//favorite
route.post('/users/:userId/favorites',userValidation,addFavorite);
route.delete('/users/:userId/favorites',userValidation,removeFavorite);
route.get('/users/:userId/favorites',userValidation,getFavorites)


//admin
route.get('/promoteadmin/:userId',promoteToAdmin)
//get users
route.get('/getAllUsers',adminRouteValidation,getAllUsers)
//category
route.post('/categories',adminRouteValidation,createCategory);
route.get('/categories',adminRouteValidation,getAllCategories);
route.delete('/categories/:categoryId',adminRouteValidation,deleteCategory);
route.post('/:categoryId/products/',adminRouteValidation,addProductToCategory);
// Route to remove a product from a category
route.delete('/categories/:categoryId/products/:productId', removeProductFromCategory);
//product
route.post('/products',addProduct);
route.get('/products',getProducts);
route.post('/products/:productId',adminRouteValidation,updateProduct);
route.delete('/products/:productId',adminRouteValidation,deleteProduct);

//order
route.get('/orders',adminRouteValidation,getAllOrderss);
route.put('/orders/:orderId/status',adminRouteValidation,updateOrderStatus);
route.delete('/deleteorder/:orderId',adminRouteValidation,deleteOrder)

//review
route.get('/reviews',adminRouteValidation,getAllReviews);
route.delete('/deletereview/:reviewId',adminRouteValidation,deleteUserReview);
//avg rating
route.get('/products/:productId/avg-rating',adminRouteValidation,calculateAverageRating)
//salesrevenue
route.get('/products/:productId/sales-revenue',adminRouteValidation,calculateSalesRevenue)
//best selling
route.get('/products/best-selling',adminRouteValidation,BestSellingProducts)
//img upload
route.post('/upload', upload.single('image'),uploadImage)

export default route;


