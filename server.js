import app from "./index.js";
import connectDB from "./config/db.js";

app.listen(3000,()=>{
  console.log("app is listining on 3000")
  connectDB();
})