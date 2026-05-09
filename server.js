import app from "./index.js";
import { connectTomongoose } from "./config/mongoose.js";

app.listen(3000,()=>{
  console.log("app is listining on 3000")
  connectTomongoose();
})