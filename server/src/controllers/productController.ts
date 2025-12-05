import { NextFunction, Request, Response } from "express";
import productModel from "../models/productModel.js";
import { z } from "zod";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
import couponModel from "../models/couponModel.js";
import { deleteTempFile } from "../services/cloudinaryService.js";
import { inngest } from "../inngest/client.js"; // optional: only if you’re using inngest

//  or use following validation
//     const querySchema = z.object({
//   page: z.coerce.number().min(1).optional(),
//   perPage: z.coerce.number().min(1).optional()
// });

// const result = querySchema.safeParse(req.query);
// if (!result.success) {
//   return res.status(400).json({ error: result.error.format() });
// }
// const { page = 1, perPage = 10 } = result.data;

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowedFields = [
      "name",
      "price",
      "category",
      "discountPercentage",
      "quantity",
      "description",
      "images",
    ];

    //Sanitize input
    const filteredBody: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    }

    //Validate category
    if (filteredBody.category) {
      if (!Types.ObjectId.isValid(filteredBody.category)) {
        res.status(400).json({
          message: "Invalid category ID format",
          success: false,
          error: true,
        });
        return;
      }
      filteredBody.category = new Types.ObjectId(filteredBody.category);
    }

    //Validate price
    const price = Number(filteredBody.price);
    if (isNaN(price) || price <= 0 || price > 100000) {
      res.status(400).json({
        message: "Invalid price: must be a number between 1 and 100000",
        success: false,
        error: true,
      });
      return;
    }
    filteredBody.price = price;

    // Handle optional discount
    const discountPercentage = Number(filteredBody.discountPercentage ?? 0);
    if (
      isNaN(discountPercentage) ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      res.status(400).json({
        message: "Invalid discountPercentage: must be between 0 and 100",
        success: false,
        error: true,
      });
      return;
    }
    filteredBody.discountPercentage = discountPercentage;

    // Calculate discount price
    filteredBody.discountPrice = Math.round(
      price * (1 - discountPercentage / 100)
    );

    // Validate quantity
    const quantity = Number(filteredBody.quantity);
    if (isNaN(quantity) || quantity < 0) {
      res.status(400).json({
        message: "Quantity must be a non-negative number",
        success: false,
        error: true,
      });
      return;
    }
    filteredBody.quantity = quantity;

    // Create product
    const product = new productModel(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      error: false,
      data: savedProduct,
    });
  } catch (error) {
    next(error); // Delegates to centralized error handler
  }
};

/**
 * Create a new product (direct Cloudinary upload version)
 * - Frontend uploads images → Cloudinary "temp/products/"
 * - On submit, backend renames them to "products/"
 * - Saves product data + image metadata in DB
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🟢 Incoming product body:", req.body);

    const {
      name,
      description,
      shortDescription,
      category,
      finalPrice,
      quantityInStock,
      brand,
      images: imagesFromClient,
    } = req.body;

    // ✅ Basic validation
    if (
      !name ||
      !description ||
      !shortDescription ||
      !category ||
      !finalPrice
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID format" });
      return;
    }

    // 🖼️ Finalize Cloudinary images
    let finalImages: any[] = [];

    if (
      imagesFromClient &&
      Array.isArray(imagesFromClient) &&
      imagesFromClient.length > 0
    ) {
      const movedImages: any[] = [];

      for (const img of imagesFromClient) {
        const publicId = img.public_id || img.publicId;
        if (!publicId) continue;

        // If image still in temp folder → move it
        if (publicId.startsWith("temp/products/")) {
          const fileName = publicId.split("/").pop(); // e.g., 1699402234_abcd123
          const newPublicId = `products/${fileName}`;

          try {
            const renamed = await cloudinary.uploader.rename(
              publicId,
              newPublicId
            );

            movedImages.push({
              public_id: renamed.public_id,
              url: renamed.secure_url,
              width: renamed.width,
              height: renamed.height,
              format: renamed.format,
              size: renamed.bytes,
              uploadedAt: new Date(),
              alt: img.alt || "",
            });

            console.log(`✅ Moved image: ${publicId} → ${newPublicId}`);
          } catch (err: any) {
            console.error(
              `❌ Failed to move ${publicId} → ${newPublicId}:`,
              err
            );
            res.status(500).json({
              message: `Error finalizing image ${publicId}`,
              error: err.message,
            });
            return;
          }
        } else {
          // Already permanent (e.g., user reuses existing image)
          movedImages.push({
            public_id: publicId,
            url: img.url || img.secure_url,
            width: img.width,
            height: img.height,
            format: img.format,
            size: img.size,
            uploadedAt: img.uploadedAt || new Date(),
            alt: img.alt || "",
          });
        }
      }

      finalImages = movedImages;
    }

    if (!finalImages || finalImages.length === 0) {
      res.status(400).json({ message: "At least one image required" });
      return;
    }

    //Generate unique SKU
    let generatedSKU = "";
    const baseSKU = `${
      brand?.substring(0, 3)?.toUpperCase() || "GEN"
    }-${Date.now().toString().slice(-6)}`;
    let counter = 0;
    while (true) {
      const candidate = counter === 0 ? baseSKU : `${baseSKU}-${counter}`;
      const exists = await productModel.exists({ sku: candidate });
      if (!exists) {
        generatedSKU = candidate;
        break;
      }
      counter++;
    }

    let generatedBarcode = "";
    while (true) {
      const candidate = `${Math.floor(
        100000000000 + Math.random() * 900000000000
      )}`; // 12-digit random number
      const exists = await productModel.exists({ barcode: candidate });
      if (!exists) {
        generatedBarcode = candidate;
        break;
      }
    }

    const newProduct = new productModel({
      name,
      description,
      shortDescription,
      category,
      brand,
      images: finalImages,
      price: finalPrice,
      quantityInStock,
      sku: generatedSKU,
      barcode: generatedBarcode,
    });

    await newProduct.save();

    // (Optional) Post-processing event
    try {
      await inngest.send({
        name: "product/created",
        data: {
          productId: newProduct._id,
          userId: (req as any).user?._id || null,
          images: finalImages,
        },
      });
    } catch {
      console.warn("⚠️ Skipping inngest event (not configured).");
    }

    console.log("✅ Product created successfully:", newProduct._id);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("💥 Error in createProduct:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(perPage) ||
      perPage <= 0 ||
      page <= 0
    ) {
      res.status(400).json({
        message: "page and perPage must be a positive number",
        success: false,
        error: true,
      });
    }

    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages && totalPages > 0) {
      res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await productModel
      .find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    //   if (!products) {return res.status(500).json({ success: false })}          //dont use this check for find() method because find() always returns an array. If you were using .findOne() or .findById(), which return null when not found, then this kind of check would be necessary

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        currentPage: page,
        perPage,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ success: false, error: true, message });
  }
};




/**
 * @desc    Get single product details by ID (specifically for Men's category)
 * @route   GET /api/v1/men/products/:productId
 * @access  Public
 */
export const getProductById = async (req:Request, res:Response) => {
    try {
        // 1. Extract the product ID from the URL parameters
        const productId = req.params.productId;

        // 2. Input Validation (optional but recommended)
        // If using Mongoose, you can check if the ID format is valid
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID format.' 
            });
        }

        // 3. Query the database for the product
        // We add an extra check: ensure the category is 'men'
        const product = await productModel.findOne({ 
            _id: productId,
            category: 'men' // Ensures only products categorized as 'men' are returned
        }).select('-__v'); // Exclude the version key from the response

        // 4. Handle Product Not Found
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: `Men's product with ID ${productId} not found.` 
            });
        }

        // 5. Successful Response
        res.status(200).json({ 
            success: true, 
            data: product 
        });

    } catch (error) {
        // 6. Handle Server Errors (e.g., database connection issues)
        console.error(`Error fetching product ID ${req.params.productId}:`, error.message);
        res.status(500).json({ 
            success: false, 
            message: 'A server error occurred while fetching the product.' 
        });
    }
};



export const getAllProductByCatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const catId = req.params.id;

    // Validate catId
    if (!catId) {
      res.status(400).json({
        message: "Category ID is required",
        success: false,
        error: true,
      });
    }

    // Validate pagination
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10000;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(perPage) ||
      page <= 0 ||
      perPage <= 0
    ) {
      res.status(400).json({
        message: "page and perPage must be positive integers",
        success: false,
        error: true,
      });
    }

    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt"; // default sort field
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // default: descending
    const inStockFilter =
      req.query.inStock === "true"
        ? true
        : req.query.inStock === "false"
        ? false
        : null;

    // Build filter object
    const filter: any = {
      catId,
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    if (inStockFilter !== null) {
      filter.inStock = inStockFilter;
    }

    // Only count products in the requested category
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    // Prevent 404 if DB is empty
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    // Fetch paginated products for the category
    const products = await productModel
      .find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        currentPage: page,
        perPage,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ success: false, error: message });
  }
};

// Utility to extract and constrain pagination parameters
const getPaginationParams = (req: Request) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, parseInt(req.query.perPage as string) || 10)
  );
  return { page, perPage };
};

// Consistent error response utility
const sendErrorResponse = (
  res: Response,
  status = 500,
  message = "An error occurred"
) => {
  return res.status(status).json({
    success: false,
    error: true,
    message,
  });
};

//ok
export const getAllProductByCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { page, perPage } = getPaginationParams(req);
    const { catName } = req.params;

    if (!catName) {
      return sendErrorResponse(res, 400, "Missing category name");
    }

    const filter = { catName };
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages && totalPages > 0) {
      return sendErrorResponse(res, 404, "Page not found");
    }

    const products = await productModel
      .find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductByCatNameController:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    sendErrorResponse(res, 500, message);
  }
};

// ok
export const getAllProductBySubCatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { page, perPage } = getPaginationParams(req);
    const { subCategoryId } = req.params;

    if (!subCategoryId) {
      return sendErrorResponse(res, 400, "Missing subCategoryId");
    }

    const filter = { subCategoryId };
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages && totalPages > 0) {
      return sendErrorResponse(res, 404, "Page not found");
    }

    const products = await productModel
      .find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductBySubCatIdController:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    sendErrorResponse(res, 500, message);
  }
};

//ok
export const getAllProductBySubCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { page, perPage } = getPaginationParams(req);
    const { catName } = req.params;

    if (!catName) {
      return sendErrorResponse(res, 400, "Missing catName");
    }

    const filter = { subCatName: catName };
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages && totalPages > 0) {
      return sendErrorResponse(res, 404, "Page not found");
    }

    const products = await productModel
      .find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductBySubCatNameController:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    sendErrorResponse(res, 500, message);
  }
};

//ok
export const getAllProductByThirdSubCatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { page, perPage } = getPaginationParams(req);
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, "Missing thirdSubCategoryId");
    }

    const filter = { thirdSubCategoryId: id };
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages && totalPages > 0) {
      return sendErrorResponse(res, 404, "Page not found");
    }

    const products = await productModel
      .find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductByThirdSubCatIdController:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    sendErrorResponse(res, 500, message);
  }
};

//ok
export const getAllProductByThirdSubCatNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { catName } = req.params;
    if (!catName || typeof catName !== "string") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Category name (catName) is required in params",
      });
    }

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const perPage = Math.min(parseInt(req.query.perPage as string) || 20, 100); // limit to max 100 per page

    const filter = { thirdSubCategoryName: catName };

    const [totalPosts, products] = await Promise.all([
      productModel.countDocuments(filter),
      productModel
        .find(filter)
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPosts > 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalItems: totalPosts,
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error("Error fetching products by thirdSubCategoryName:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

//============================get products by rating=====================

// export const getAllProductByRating = async (
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

//     let products = [];

//     if(req.query.catId !== undefined) {
//       products = await productModel.find({
//       rating:req.query.rating,
//       catId:req.query.catId,

//     }) .populate("category")
//     .skip((page - 1) * perPage)
//     .limit(perPage)
//     .exec();
//     }

//     if(req.query.subCategoryId !== undefined) {
//       products = await productModel.find({
//       rating:req.query.rating,
//       subCategoryId:req.query.subCategoryId,
//     }) .populate("category")
//     .skip((page - 1) * perPage)
//     .limit(perPage)
//     .exec();
//     }

//     if(req.query.thirdSubCategoryId !== undefined) {
//       products = await productModel.find({
//       rating:req.query.rating,
//       thirdSubCategoryId:req.query.thirdSubCategoryId,
//     }) .populate("category")
//     .skip((page - 1) * perPage)
//     .limit(perPage)
//     .exec();
//     }

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

// export const getAllProductByRating = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const page = Math.max(parseInt(req.query.page as string) || 1, 1);
//     const perPage = Math.min(parseInt(req.query.perPage as string) || 20, 100);

//     const rating = parseFloat(req.query.rating as string);
//     if (isNaN(rating)) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: 'Invalid or missing "rating" query parameter',
//       });
//     }

//     // Build dynamic filter
//     const filter: any = { rating };

//     if (req.query.catId) filter.catId = req.query.catId;
//     if (req.query.subCategoryId) filter.subCategoryId = req.query.subCategoryId;
//     if (req.query.thirdSubCategoryId) filter.thirdSubCategoryId = req.query.thirdSubCategoryId;

//     const totalProducts = await productModel.countDocuments(filter);
//     const totalPages = Math.ceil(totalProducts / perPage);

//     if (page > totalPages && totalProducts > 0) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: 'Page not found',
//       });
//     }

//     const products = await productModel
//       .find(filter)
//       .populate('category')
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .lean();

//     return res.status(200).json({
//       success: true,
//       error: false,
//       data: products,
//       pagination: {
//         page,
//         perPage,
//         totalItems: totalProducts,
//         totalPages,
//       },
//     });

//   } catch (error) {
//     console.error('Error fetching products by rating:', error);
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: error instanceof Error ? error.message : 'Internal server error',
//     });
//   }
// };

// Zod schema for validation

// const ratingQuerySchema = z.object({
//   page: z
//     .string()
//     .optional()
//     .transform((val) => parseInt(val || "1"))
//     .refine((val) => val > 0, { message: "Page must be positive" }),
//   perPage: z
//     .string()
//     .optional()
//     .transform((val) => parseInt(val || "20"))
//     .refine((val) => val > 0 && val <= 100, {
//       message: "perPage must be between 1 and 100",
//     }),
//   rating: z
//     .string()
//     .optional()
//     .transform(Number)
//     .refine((val) => !isNaN(val), { message: "Rating must be a number" }),
//   minRating: z
//     .string()
//     .optional()
//     .transform(Number)
//     .refine((val) => !isNaN(val), { message: "minRating must be a number" }),
//   maxRating: z
//     .string()
//     .optional()
//     .transform(Number)
//     .refine((val) => !isNaN(val), { message: "maxRating must be a number" }),
//   sort: z.enum(["asc", "desc"]).optional(),
//   catId: z.string().optional(),
//   subCategoryId: z.string().optional(),
//   thirdSubCategoryId: z.string().optional(),
// });

// export const getAllProductByRating = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     // ✅ Validate & parse query
//     const parsed = ratingQuerySchema.safeParse(req.query);

//     if (!parsed.success) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Invalid query parameters",
//         issues: parsed.error.format(),
//       });
//     }

//     const {
//       page,
//       perPage,
//       rating,
//       minRating,
//       maxRating,
//       sort,
//       catId,
//       subCategoryId,
//       thirdSubCategoryId,
//     } = parsed.data;

//     // ✅ Build query filter
//     const filter: any = {};

//     if (typeof rating === "number") {
//       filter.rating = rating;
//     } else {
//       if (typeof minRating === "number" || typeof maxRating === "number") {
//         filter.rating = {};
//         if (typeof minRating === "number") filter.rating.$gte = minRating;
//         if (typeof maxRating === "number") filter.rating.$lte = maxRating;
//       }
//     }

//     if (catId) filter.catId = catId;
//     if (subCategoryId) filter.subCategoryId = subCategoryId;
//     if (thirdSubCategoryId) filter.thirdSubCategoryId = thirdSubCategoryId;

//     // ✅ Count documents with filter
//     const totalItems = await productModel.countDocuments(filter);
//     const totalPages = Math.ceil(totalItems / perPage);

//     if (page > totalPages && totalItems > 0) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "Page not found",
//       });
//     }

//     // ✅ Sort logic
//     // ✅ FIX: Strongly typed sortOption
//     const sortOption: Record<string, 1 | -1> = sort
//       ? { rating: sort === "asc" ? 1 : -1 }
//       : {};

//     // ✅ Fetch data
//     const products = await productModel
//       .find(filter)
//       .populate("category")
//       .sort(sortOption)
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .lean();

//     return res.status(200).json({
//       success: true,
//       error: false,
//       data: products,
//       pagination: {
//         totalItems,
//         totalPages,
//         page,
//         perPage,
//       },
//     });
//   } catch (error) {
//     console.error("getAllProductByRating error:", error);
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: error instanceof Error ? error.message : "Internal server error",
//     });
//   }
// };

export const getAllProductByPriceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      catId,
      subCategoryId,
      thirdSubCategoryId,
      minPrice,
      maxPrice,
      page = "1",
      limit = "20",
    } = req.query;

    const parsedPage = Math.max(parseInt(page as string), 1);
    const parsedLimit = Math.min(parseInt(limit as string), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    // 🧠 Build dynamic query
    const filter: Record<string, any> = {};

    if (catId) filter.catId = catId;
    if (subCategoryId) filter.subCategoryId = subCategoryId;
    if (thirdSubCategoryId) filter.thirdSubCategoryId = thirdSubCategoryId;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    // ⚡ Query database
    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .populate("category")
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parsedPage,
        perPage: parsedLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching products by price:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

//ok
export async function getProductsCount(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Optional: future filter support (e.g., only active products)
    const filter: any = {}; // e.g., { isActive: true }

    const productsCount = await productModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      error: false,
      data: {
        count: productsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

//ok
export const getAllFeaturedProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;

    // If either page or limit is missing, fetch all products without pagination
    if (typeof pageParam === "undefined" || typeof limitParam === "undefined") {
      const allProducts = await productModel
        .find({ isFeatured: true })
        .populate("category")
        .lean();
      res.status(200).json({
        success: true,
        error: false,
        data: allProducts,
        pagination: null,
      });
    }

    const page = Math.max(parseInt(pageParam as string), 1);
    const limit = Math.min(parseInt(limitParam as string), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productModel
        .find({ isFeatured: true })
        .populate("category")
        .skip(skip)
        .limit(limit)
        .lean(),
      productModel.countDocuments({ isFeatured: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      error: false,
      data: products,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

//ok
export const getSingleProductByIdController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  // ✅ Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Invalid product ID format",
    });
  }

  try {
    const product = await productModel
      .findById(id)
      .populate("category", "name _id") // ✅ Only populate necessary fields
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: product,
    });
  } catch (err) {
    console.error(`Error fetching product by ID (${id}):`, err);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
};

//ok
export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: true,
        message: "Invalid product ID",
      });
      return;
    }

    // Find product by ID
    const product = await productModel.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
      return;
    }

    // Delete images from Cloudinary (if any)
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      for (const img of product.images) {
        const publicId =
          typeof img === "string"
            ? img.split("/").pop()?.split(".")[0]
            : img.public_id;
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn(`Failed to delete Cloudinary image ${publicId}:`, err);
          }
        }
      }
    }

    // Delete product from DB
    await productModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      error: false,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error); // centralized error handler
  }
};

//ok
// //DELETE image from cloudinary
// await axios.delete("/api/cloudinary/remove", {
//   params: { img: imageUrl },
// });
export async function removeImageFromCloudinary(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const imgUrl = req.query.img as string;
    const publicIdFromBody = req.body.public_id as string;

    let publicId: string | undefined;

    // Use public_id if provided
    if (publicIdFromBody) {
      publicId = publicIdFromBody;
    } else if (imgUrl) {
      // Extract public_id from URL
      const urlSegments = imgUrl.split("/");
      const filename = urlSegments[urlSegments.length - 1]; // e.g., 'image123.jpg'
      publicId = filename.split(".")[0]; // e.g., 'image123'
    }

    if (!publicId) {
      res.status(400).json({
        success: false,
        error: true,
        message: "Image URL or public_id is required",
      });
      return;
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.status(200).json({
        success: true,
        error: false,
        message: "Image deleted successfully",
        result,
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: "Failed to delete image",
        result,
      });
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

//ok
export const updateProductController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate fields (optional – better done via middleware or schema validation)
    const updateData = req.body;

    // Update product and return the updated document
    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // ensure validation rules still apply
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //imagesArr = [];
    // Recalculate discountPrice after update
    if (product.price && product.discountPercentage !== undefined) {
      product.discountedPrice = Math.round(
        product.price * (1 - product.discountPercentage / 100)
      );
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);

    const message = err instanceof Error ? err.message : "Unknown server error";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

// //single controller instead of using multiple controllers(getAllProductByCatIdController, getAllProductBySubCatIdController)
// export const getFilteredProductsController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const {
//       page = "1",
//       perPage = "10",
//       search,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       inStock,
//     } = req.query;

//     const catId = req.params.catId;
//     const subCategoryId = req.params.subCategoryId;

//     // Validate pagination
//     const currentPage = Number(page);
//     const limit = Number(perPage);

//     if (!Number.isInteger(currentPage) || !Number.isInteger(limit) || currentPage <= 0 || limit <= 0) {
//       return res.status(400).json({
//         message: "'page' and 'perPage' must be positive integers",
//         success: false,
//         error: true,
//       });
//     }

//     // Build dynamic filter
//     const filter: any = {};

//     if (catId) filter.catId = catId;
//     if (subCategoryId) filter.subCategoryId = subCategoryId;

//     if (search) {
//       filter.name = { $regex: search.toString(), $options: "i" };
//     }

//     if (inStock === "true") filter.inStock = true;
//     if (inStock === "false") filter.inStock = false;

//     // Get total count
//     const totalProducts = await productModel.countDocuments(filter);
//     const totalPages = Math.ceil(totalProducts / limit);

//     if (currentPage > totalPages && totalPages > 0) {
//       return res.status(404).json({
//         message: "Page not found",
//         success: false,
//         error: true,
//       });
//     }

//     const products = await productModel
//       .find(filter)
//       .populate("category")
//       .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
//       .skip((currentPage - 1) * limit)
//       .limit(limit);

//     return res.status(200).json({
//       success: true,
//       error: false,
//       data: products,
//       pagination: {
//         currentPage,
//         perPage: limit,
//         totalProducts,
//         totalPages,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching filtered products:", error);
//     const message = error instanceof Error ? error.message : "Unknown error occurred";
//     return res.status(500).json({ success: false, error: message });
//   }
// };

export const checkoutController = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1, couponCode, userId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let discountPercentage = 0;

    if (couponCode) {
      const coupon = await couponModel.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (
        !coupon ||
        coupon.expiresAt < new Date() ||
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired coupon" });
      }

      if (
        coupon.applicableUsers.length &&
        !coupon.applicableUsers.some((id) => id.toString() === userId)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Coupon not valid for user" });
      }

      discountPercentage = coupon.discountPercentage;
      coupon.usedCount += 1;
      await coupon.save();
    }

    const totalPrice = product.price * quantity;
    const finalPrice = Math.round(totalPrice * (1 - discountPercentage / 100));

    res.status(200).json({
      success: true,
      product: {
        name: product.name,
        quantity,
        originalPrice: product.price,
        discountPercentage,
        finalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
};



// export async function productFiltersController(req:Request, res:Response){
//   const {catId, subCatId, thirdSubCatId,minPrice, maxPrice, rating, page, limit} = req.body;
//   const filters = {}

//   if(catId?.length){
//     filters.catId = {$in: catId}
//   }
//   if(subCatId?.length){
//     filters.catId = {$in: subCatId}
//   }
//   if(thirdSubCatId?.length){
//     filters.catId = {$in: thirdSubCatId}
//   }

//   if(minPrice || maxPrice){
//     filters.price = {$gte: +minPrice || 0, $lte: +maxPrice || Infinity};
//   }

//   if(rating?.length){
//     filters.rating = {$in: rating}
//   }

//   try{
//     const products = await ProductModel.find(filters).populate("category".skip(page - 1) * limit).limit(parseInt(limit));
//     const total = await ProductModel.countDocuments(filters);
//     return res.status(200).json({
//       error:false,
//       success:true,
//       products:products,
//       total:total,
//       page:parseInt(page),
//       totalPages:Match.ceil(total / limit)
//     })
//   } catch(){
//     return  res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     })
//   }

// }






export async function filters(request, response){
  const {catId, subCatId, thirdSubCategoryId, minPrice, maxPrice, rating, page, limit} = request.body;

  const filters = {}

  if(catId?.length){
    filters.catId = {$in: catId}
  }
  if(subCatId?.length){
    filters.subCatId = {$in: subCatId}
  }
  if(thirdSubCategoryId?.length){
    filters.thirdSubCategoryId = {$in: thirdSubCategoryId}
  }

  if(minPrice || maxPrice){
    filters.price = {$gte: +minPrice || 0, $lte: +maxPrice || Infinity}
  }

  if(rating?.length){
    filters.rating = {$in: rating}
  }

  try {
    const products = await productModel.find(filters).populate("category".skip(page - 1) * limit).limit(parseInt(limit));
    const total = await productModel.countDocuments(filters);
    return response.status(200).json({
      error: false,
      success: true,
      products:products,
      total:total,
      page:parseInt(page),
      totalPages: Math.ceil(total/limit)
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}