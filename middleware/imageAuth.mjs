import multer from "multer";
import path from "path";

//Disk storage engine

/*Takes two options
1. destination: destination is used to determine within which folder the uploaded files should be stored. 
2. filename: filename is used to determine what the file should be named inside the folder. 
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //destination folder for storing uploaded images
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname) ;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

//function to control which files should be uploaded and which should be skipped.

function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if(file.mimetype.startsWith("image/")){
        // To accept the file pass `true`, like so:
        cb(null, true);
    }
    else{
        // You can always pass an error if something goes wrong:
        cb(new Error('Only images are allowed'),false);
    }      
}

const upload = multer({ storage: storage, fileFilter:fileFilter });
//shorter way:const upload = multer({ storage, fileFilter });
export default upload;