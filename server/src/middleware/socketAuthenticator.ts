export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const user = {}

    // const authToken = socket.request.cookies[CHATTU_TOKEN];

    // if (!authToken)
    //   return next(new ErrorHandler("Please login to access this route", 401));

    // const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    // const user = await User.findById(decodedData._id);

    // if (!user)
    //   return next(new ErrorHandler("Please login to access this route", 401));

    // socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    //return next(new errorHandler("Please login to access this route", 401));
  }
};