import mongoose from "mongoose";
import configObject from "./config/config.js";
const { mongo_url } = configObject;

mongoose
  //.connect(mongo_url)
  .connect(
    "mongodb+srv://brunox86:coderhouse@cluster0.y6jrdwz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected  to DB"))
  .catch((error) => console.log("Connection Error"));

// class DataBase {
//   static #instance;

//   constructor() {
//     mongoose.connect(mongo_url);
//   }

//   static getInstance() {
//     if (this.#instance) {
//       console.log("Conexión previa");
//       return this.#instance;
//     }

//     this.#instance = new DataBase();
//     console.log("Conexión exitosa");
//     return this.#instance;
//   }
// }

//export default DataBase.getInstance;
