import multer, { StorageEngine } from "multer";
import path from "path";


// ===== Allowed Types & Limits =====
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE_MB = 5; // 5 MB
const MAX_FILES = 8;


// ===== Multer Local Temp Storage =====
const storage: StorageEngine = multer.diskStorage({
  //here you can also use memoryStorage.
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// ===== File Filter =====
const fileFilter = (req: any, file: any, cb: any) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    // or u can write if(file.mimetype.startsWith("image"))
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// ===== Multer Middleware =====
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 5mb
  },
});

const uploadSingle  = multerUpload.single("image");
const uploadMultiple  = multerUpload.array("images", MAX_FILES);

export { uploadSingle , uploadMultiple  };



