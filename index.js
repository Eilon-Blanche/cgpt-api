const express = require("express");
const app = express();
const openaiplugin = require("openai");
const bodyParser = require("body-parser");
require('dotenv').config();

const openai = new openaiplugin.OpenAI({
    apiKey: process.env.API_TOKEN,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
	console.log("Server started at port 8000");
});

app.post("/text", async (req, res) => {
	try {
        let prompt = req.body.prompt;
        if(Object.keys(req.body).length > 1 || Object.keys(req.body).length === 0){
            throw new Error('Invalid Input');
        }
        if(!req.body.hasOwnProperty('prompt')){
            throw new Error('Invalid Input');
        }
        if(!prompt){
            throw new Error('Invalid Input');
        }
        const response = await textGenerate(prompt);
        res.status(200).json(response);

	} catch (err) {
		res.status(500).json({ error : err.message });
	}
});


app.post("/image", async (req, res) => {
	try {
        let prompt = req.body.prompt;
        if(Object.keys(req.body).length > 1 || Object.keys(req.body).length === 0){
            throw new Error('Invalid Input');
        }
        if(!req.body.hasOwnProperty('prompt')){
            throw new Error('Invalid Input');
        }
        if(!prompt){
            throw new Error('Invalid Input');
        }
		const response = await imageGenerate(prompt);
		res.status(200).json({ imageUrl : response});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function textGenerate(prompt) {
    const response = await openai.chat.completions.create({
        messages: [{
            "role": "user",
            "content": prompt + " limit of 10 characters"}
        ],
        model: process.env.CGPT_TEXT_MODEL,
    });
    return response.choices[0].message;
}

async function imageGenerate(prompt) {
	const response = await openai.images.generate({
		model: process.env.CGPT_IMAGE_MODEL,
		prompt: prompt,
		n: 1
	});
	return response.data[0].url
}