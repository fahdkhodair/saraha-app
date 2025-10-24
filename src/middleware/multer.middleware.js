import multer from "multer";
import fs from "fs";
function createFolder(folderPath) {
    console.log(folderPath);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

const multersotrage = () => {
    const folderPath = 'sample';
    const fileDir = `uploads/${folderPath}`;
    createFolder(fileDir);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fileDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
        }
    });

    const limits = {
        files: 4,
        fileSize: 1024 * 1024 * 5
    };

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image file'), false);
        }
    };

    return multer({ storage, fileFilter,limits:{
        files:4,
        
    }});
};
export {multersotrage}
    
