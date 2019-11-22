const mongoose = require('mongoose');
const db = 'mongodb+srv://ongkelden:d5092940@de3trvctions-tqago.mongodb.net/webapi?retryWrites=true&w=majority';
mongoose.connect(db).then(()=> {
    console.log("Connected to database");
})
.catch(()=> {
    console.log("Error Connected to database");
})

const schema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    cover:{
        type: String
    },
    rating:{
        type: String
    },
    release:{
        type: String
    },
    genres:[{
        type: Object
    }],
    summary:{
        type: String
    },
    website:{
        type: String
    }
});

const Index = mongoose.model("gameData", schema, 'gamedatas');
module.exports = Index;