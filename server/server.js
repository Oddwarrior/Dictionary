const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {

    res.status(200).send({
        "message": "Hello from shashank"
    })
});

app.post('/', async (req, res) => {
    try {
        const text = req.body.text;
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
            .then((response) => {
                // const meaning1 = response.data[0].meanings[0].definitions[0]?.definition;
                // const meaning2 = response.data[0].meanings[0].definitions[1]?.definition;

                const meaning = response.data[0]?.meanings[0]?.definitions;

                res.status(200).send({
                    m: meaning ? meaning : null,
                });
            })

        // res.status(200).send(response);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
})


app.listen(3000, () => {
    console.log("Server  is running on port 3000 ");
})