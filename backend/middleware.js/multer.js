
import multer from "multer";

const storageconfig=multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
        // const name=Date.now() + "-" + file.originalname;
        cb(null,Date.now() + "-" + file.originalname);
    }
})

export const fileupload=multer({storage:storageconfig});