import { connectDB } from "./db/databse.js";
import app from "./server.js"

connectDB()
    .then(async () => {
        app.on("error", (error) => {
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on PORT: ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Mongodb connection failed", error);
        process.exit(1);
    })