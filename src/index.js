import dotenv from "dotenv";
import connetDb from "./db/index.js";

dotenv.config(
    {
        path: "./env"
    }
);

connetDb()
.then(() => {
    console.log("Mongodb connection Successful");
})
.catch((error) => {
    console.log(`Mongodb connection Failed: ${error}`);
})
/*
const app = express(); //app
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log(error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
})
*/