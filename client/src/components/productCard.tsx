import React from 'react'

const ProductCard = () => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden">
                    <div className="bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group">
                      <Link
                        to={`/productdetails/${product.id}`}
                        className="w-full h-[200px] relative overflow-hidden"
                      >
                        <img
                          src={product.images[0]}
                          className="w-full opacity-100 hover:opacity-0 transition duration-500"
                        />
                        <img
                          src={product.images[1]}
                          className="w-full absolute top-[0px] left-[0px] opacity-0 group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500"
                        />
                      </Link>

                      <div className="bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50">
                        {product.discount}%
                      </div>

                      <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                        <div
                          className="h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
                          onClick={handleClickOpen}
                        >
                          <IoExpand />
                        </div>
                        <div className="h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white hover:bg-red-500 transition-all cursor-pointer">
                          <FaRegHeart />
                        </div>
                      </div>
                    </div>

                    <div className="info flex flex-col itms-center hustify-center w-full p-3">
                      <h6 className="text-[14px] font-[600] capitalize mt-2">
                        <Link to="/" className="link">
                          {product.name}
                        </Link>
                      </h6>
                      <p className="text-[13px] font-[400] text-gray-500 dark:text-gray-300 mt-1">
                        {product.brand}
                      </p>
                      <h3 className="text-[13px] font-[300] leading-[20px] mt-2 text-[rgba(0,0,0,0.6)] dark:text-gray-300 transition-all">
                        {product.description}
                      </h3>

                      <div className="flex items-center justify-between w-full py-2">
                        <p className="text-[16px] font-medium line-through text-gray-600 dark:text-gray-300">
                          ${product.originalPrice}
                        </p>
                        <p className="text-[16px] font-bold text-red-400">
                          ${product.price}
                        </p>
                      </div>

                      {/* ✅ Cart Button Logic */}
                      {!inCart ? (
                        <Button
                          className="flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCartCheckoutIcon /> ADD TO CART
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between !w-[90%] border border-red-400 rounded-md !mx-auto !my-4 text-red-400">
                          {/* <IconButton
                              onClick={() => handleRemove(product.id)}
                              className="!text-red-400"
                            >
                              <DeleteOutlineIcon />
                            </IconButton> */}
                          <IconButton
                            onClick={() => handleDecrease(product.id)}
                            className="!text-red-400 cursor-pointer border-r"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Button
                            onClick={() => navigate("/cart")}
                            className="!text-red-400 font-medium text-nowrap"
                          >
                            GO TO CART ({qty})
                          </Button>
                          <IconButton
                            onClick={() => handleIncrease(product.id)}
                            className="!text-red-400 cursor-pointer"
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
    </>
  )
}

export default ProductCard
