import uploadProductPermissions from "../helpers/permission.js";
import Product from "../modules/product.js";


//create product
export const CreateProduct = async (req, res) => {
    try {
        const sessionUserId = req.userId;

        // Await the result of the permission check
        const hasPermission = await uploadProductPermissions(sessionUserId);

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });
        }

        // Preprocess productImage field if it exists
        // if (req.body.productImage) {
            // req.body.productImage = req.body.productImage.split(',').map(image => image.trim());
        // }

        const uploadProduct = new Product(req.body);
        const saveProduct = await uploadProduct.save();

        res.status(200).json({
            success: true,
            message: "Product created successfully",
            product: saveProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
};


//get all products

export const GetProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        res.status(200).json({
            success: true,
            products,
            message: "All products"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//get one product

export const GetProduct = async (req, res) => {
    try {

        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Product ID not provided"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product,
            message: "Product found"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    if (!uploadProductPermissions(req.userId)) {
      return res.status(401).json({
        message: "Unauthorized to update product",
        success: false,
        error: true,
      });
    }

    const { _id, ...resBody } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    const updateProduct = await Product.findByIdAndUpdate(_id, resBody, {
      new: true, // This option returns the updated document
      runValidators: true, // Run validators on the updated fields
    });

    if (!updateProduct) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Product updated successfully",
      data: updateProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};



//delete product

export const DeleteProduct = async (req, res) => {
    try {
         const {id} = req.params;

         if(!id){
             return res.status(400).json({
                 success: false,
                 message: "Product ID not provided"
             });
         }

         const product = await Product.findByIdAndDelete(id);

         if (!product) {
             return res.status(404).json({
                 success: false,
                 message: "Product not found"
             });
         }

         res.status(200).json({
             success: true,
             message: "Product deleted successfully"
         });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//get products by category
// Get all products in the same category as the product with the given ID
export const getProductsByCategoryId = async (req, res) => {
    try {
        // Extract the product ID from query parameters
        const { id } = req.params;

        // Find the product with the given ID
        const product = await Product.findById(id);

        // If the product is not found, return an error response
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // Find all products in the same category as the found product
        const productsInSameCategory = await Product.find({ category: product.category });

        // Respond with the products in the same category
        res.status(200).json({
            message: "Products in the same category",
            success: true,
            data: productsInSameCategory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            success: false
        });
    }
}



export const searchProduct = async(req,res)=>{
    try{
        const query = req.query.q 

        const regex = new RegExp(query,'i','g')

        const product = await Product.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })


        res.json({
            data  : product ,
            message : "Search Product list",
            error : false,
            success : true
        })
    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

