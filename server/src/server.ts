import express from 'express';

const app = express();


app.get('/users', (req, res) => {
    res.json({"msg": "hello world"})
})

app.listen(3333);
