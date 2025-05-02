import app from "./app.js";

const port = process.env.PORT || 3000;



app.listen(3000, () =>{
    console.log(`Server is running on port ${port}`);
})