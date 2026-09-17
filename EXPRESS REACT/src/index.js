import express from express;
import cors from cors;
import fs from fs;
app.use(cors());
app.use(express.json());

app.get("/prducts" , (req,res) => {
    // const data = req.data;
    const data = fs.readFile("products.json","utf-8")
    const product = JSON.parse(data);
    res.json(product);
});

app.post("/products", (req,res) => {
    const data = fs.readFile("products.json","utf-8")
});

app.listen(4000, () => {
    console.log("server is running on port 4000");
})