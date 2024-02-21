import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://brunox86:coderhouse@cluster0.y6jrdwz.mongodb.net/Tienda?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conectados a DB"))
  .catch((error) => console.log(error));
