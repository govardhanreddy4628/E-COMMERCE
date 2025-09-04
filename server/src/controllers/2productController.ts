
// export const getAllProductByPriceController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | any> => {
//   let productList = [];

//   if(req.query.catId != "" && req.query.catId !== undefined) {
//     const productListArr = await productModel.find({
//       catId: req.query.catId,
//     }).populate("category");

//     productList = productListArr;
//   }

//   if(req.query.subCategoryId !== "" && req.query.subCategoryId !== undefined) {
//     const productListArr = await productModel.find({
//       subCategoryId: req.query.subCategoryId,
//     }).populate("category");

//     productList = productListArr;
//   }

//   if(req.query.thirdSubCategoryId !== "" && req.query.thirdSubCategoryId !== undefined) {
//     const productListArr = await productModel.find({
//       thirdSubCategoryId: req.query.thirdSubCategoryId,
//     }).populate("category");

//     productList = productListArr;
//   }

//   const filteredProducts = productList.filter((product) => {
//     if(req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
//       return false;
//     }
//     if(req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
//       return false;
//     }
//     return true;
//   })
//   try {    
//     return res.status(200).json({
//       error:false,
//       success: true,
//       data: filteredProducts,
//       totalPages: 0,
//       page: 0,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ success: false, error: error.message });
//     } else {
//     res.status(500).json({ success: false, error: "Unknown error occurred" });
//     }
//     console.log(error);
//   }
// };




export const getAllProductByCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return res.status(404).json({
        message:"page not found",
        success: false,
        error: true
      })
    }

    const products = await productModel.find({catName:req.params.catName}) .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    
    if (!products) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      error:false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
    res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
    console.log(error);
  }
};




// export const getAllProductBySubCatIdController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | any> => {
//   try {

//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.perPage) || 10000;
//     const totalPosts = await productModel.countDocuments();
//     const totalPages = Math.ceil(totalPosts / perPage);

//     if(page > totalPages) {
//       return res.status(404).json({
//         message:"page not found",
//         success: false,
//         error: true
//       })
//     }

//     const products = await productModel.find({subCategoryId : req.params.subCategoryId}) .populate("category")
//     .skip((page - 1) * perPage)
//     .limit(perPage)
//     .exec();

    
//     if (!products) {
//       return res.status(500).json({ success: false });
//     }
//     res.status(200).json({
//       error:false,
//       success: true,
//       data: products,
//       totalPages: totalPages,
//       page: page,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ success: false, error: error.message });
//     } else {
//     res.status(500).json({ success: false, error: "Unknown error occurred" });
//     }
//     console.log(error);
//   }
// };



export const getAllProductBySubCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return res.status(404).json({
        message:"page not found",
        success: false,
        error: true
      })
    }

    const products = await productModel.find({subCatName:req.params.catName}) .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    
    if (!products) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      error:false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
    res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
    console.log(error);
  }
};



export const getAllProductByThirdSubCatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return res.status(404).json({
        message:"page not found",
        success: false,
        error: true
      })
    }

    const products = await productModel.find({thirdSubCategoryId:req.params.id}) .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    
    if (!products) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      error:false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
    res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
    console.log(error);
  }
};



export const getAllProductByThirdSubCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return res.status(404).json({
        message:"page not found",
        success: false,
        error: true
      })
    }

    const products = await productModel.find({thirdSubCategoryName:req.params.catName}) .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    
    if (!products) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      error:false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
    res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
    console.log(error);
  }
};




export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { id } = req.params;
    const products = await productModel.findById({ id }).populate("category");

    if (!products) {
      return res.status(500).json({ success: false });
    }

    const images = products.images;

    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const images = urlArr[urlArr.length - 1];

      const imageName = images.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result)
        });
      }
    }

    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      res.status(404).json({
        message: "Product not deleted!",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      products: products,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
    console.log(error);
  }
};