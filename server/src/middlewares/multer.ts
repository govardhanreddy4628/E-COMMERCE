import multer, {StorageEngine} from "multer"
import path from "path"

const storage: StorageEngine = multer.diskStorage({        //here you can also use memoryStorage.
    destination: function (req, file, cb) {
         cb(null, path.join(__dirname, "../public/temp"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});

const upload  = multer({
    storage:storage,
    limits:{
        fileSize: 5*1024*1024 ,// 5mb
    }
})
export default upload;