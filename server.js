import app from "./src/app.js";
import dbConnectionHandler from "./src/config/db.js";
import dotenv from 'dotenv'

dotenv.config();
const PORT = process.env.PORT || 4000;

dbConnectionHandler().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
}).catch((err)=>{
    console.log(err)
});