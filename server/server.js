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
        if (text.length == 0) return res.status(500).send({ message: "Please enter a valid word" });

        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
        const meaning = response.data[0]?.meanings[0];
        res.status(200).send({
            definition: meaning.definitions,
            partOfSpeech: meaning.partOfSpeech,
        })
        // res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Sorry pal, we couldn't find definitions for the word you were looking for." })
    }
})


app.listen(3000, () => {
    console.log("Server  is running on port 3000 ");
})