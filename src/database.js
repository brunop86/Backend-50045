import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://brunox86:coderhouse@cluster0.y6jrdwz.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected  to DB"))
  .catch((error) => console.log(error));
