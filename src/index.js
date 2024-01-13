import dotenv from "dotenv";
import connetDb from "./db/index.js";
import app from "./app.js";
dotenv.config(
    {
        path: "./env"
    }
);

connetDb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
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