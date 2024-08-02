import AddToCart from "../modules/cart.js";

// add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const currentUser = req.userId;

        if(!currentUser){
            return res.status(401).json({
                success: false,
                message: "Login to shop now",
                error: true,
            });
        }

        const isProductAvailable = await AddToCart.findOne({ productId, userId: currentUser });

        if (isProductAvailable) {
            return res.status(200).json({
                message: "Already exists in Add to cart",
                success: false,
                error: true,
            });
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new AddToCart(payload);
        const saveProduct = await newAddToCart.save();

        return res.status(200).json({
            data: saveProduct,
            message: "Product Added to Cart",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred",
            error: true,
            success: false,
        });
    }
};


// get count product from cart

export const CountAddToCartProduct = async(req,res)=>{
    try{
        const userId = req.userId

        const count = await AddToCart.countDocuments({
            userId : userId
        })

        res.json({
            data : {
                count : count
            },
            message : "ok",
            error : false,
            success : true
        })
    }catch(error){
        res.json({
            message : error.message || error,
            error : false,
            success : false,
        })
    }
}

//view product in cart

export const addToCartViewProduct = async (req, res) => {
    try {
        const currentUser = req.userId;

        const allProducts = await AddToCart.find({ userId: currentUser }).populate('productId');

        res.json({
            data: allProducts,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'An error occurred while retrieving the cart products.',
            error: true,
            success: false
        });
    }
};

//update product quantity in cart

export const updateAddToCartProduct = async (req, res) => {
    try {
      const currentUserId = req.userId;
  
      if (!currentUserId) {
        return res.status(401).json({
          message: "Login to shop now",
          error: true,
          success: false,
        });
      }
  
      const addToCartProductId = req.body._id;
      const qty = req.body.quantity;
  
      if (!addToCartProductId || qty === undefined) {
        return res.status(400).json({
          message: "Product ID and quantity are required",
          error: true,
          success: false,
        });
      }
  
      const updateProduct = await AddToCart.updateOne(
        { _id: addToCartProductId, userId: currentUserId },
        {
          ...(qty && { quantity: qty }),
        }
      );
  
      if (updateProduct.nModified === 0) {
        return res.status(404).json({
          message: "Product not found or no changes made",
          error: true,
          success: false,
        });
      }
  
      res.json({
        message: "Product Updated",
        data: updateProduct,
        error: false,
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }
  };



  //product delete cart
export const deleteAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req.body._id;

    console.log("User ID:", currentUserId); // Log the user ID
    console.log("Product ID:", addToCartProductId); // Log the product ID

    const deleteProduct = await AddToCart.deleteOne({ _id: addToCartProductId });

    console.log("Delete Result:", deleteProduct); // Log the result of deletion

    if (deleteProduct.deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found in cart.",
        error: true,
        success: false,
      });
    }

    res.json({
      message: "Product deleted from cart",
      error: false,
      success: true,
      data: deleteProduct
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "An error occurred",
      error: true,
      success: false
    });
  }
};

  