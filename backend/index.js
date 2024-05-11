const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors(
    {
     origin : ["vottingsystem-frontend.vercel.app"],
    methods : ["POST", "GET"],
   credentials : true
    }
    
))
mongoose.connect('mongodb+srv://jigneshsharma9868:AkONuVfT0VTg4JNq@cluster0.hu1lbos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const Vote = mongoose.model('Vote', {option : String});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// handle vote subission
app.post('/submit', async(req,res) => {
    const {option} = req.body;
    try {
        await Vote.create({option});
        res.send("vote subitted successfully");
    } catch(err) {
        console.log('Error in subitting vote:', err);
        res.status(500).send('error submitting vote');
    }
});
app.get('/results', async (req, res) => {
    try {
        const total = await Vote.countDocuments();
        const results = await Vote.aggregate([
            { $group: { _id: '$option', count: { $sum: 1 } } }
        ]);
        const formattedResults = results.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {});
        res.json({ total, results: formattedResults });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Error fetching results');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
