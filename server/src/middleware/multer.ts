import multer, {StorageEngine} from "multer"
import path from "path"

const storage: StorageEngine = multer.diskStorage({        //here you can also use memoryStorage.
    destination: function (req, file, cb) {
         cb(null, path.join(__dirname, "../../public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
  if (allowedTypes.includes(file.mimetype)) {       // or u can write if(file.mimetype.startsWith("image"))
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload  = multer({
    storage:storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: 5*1024*1024 ,// 5mb
    }
})
export default upload;