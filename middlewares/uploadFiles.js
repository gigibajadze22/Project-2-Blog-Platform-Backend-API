import multer from 'multer'
import path from 'path';


const uploadDir = './uploads'

const storage = multer.diskStorage({
    destination: (req,file, cb)  =>{
        cb(null, uploadDir)
    },
    filename: (req,file,cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null,uniqueSuffix + path.extname(file.originalname))
    }
})

const filterFiles = (req,file,cb) =>{
    const allowedFileTypes = [
        'image/jpeg',
        'image/png', 
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel' 
    ];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error('Invalid file type'))
    }
}


const upload = multer({
    storage: storage,
    fileFilter: filterFiles,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})


export default upload