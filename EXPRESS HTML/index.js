import express from "express";
import fs from "fs";

const app = express();

app.get('/', (req,res) => {
    fs.readFile('./Pages/Home.html','isUtf8', (err,data) => {
        if(err) {
            res.status(500).send("Error reading file");
            return;
        }
        else {
            res.send(data);
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})