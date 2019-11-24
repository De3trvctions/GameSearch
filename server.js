const axios = require('axios');
const express = require('express');
const Index = require('./database');
const app = express();
const API_KEY = "33e72da34a3707ac390b1157103a476c";

var genresArray = [];
var gName;
var gameID;
var website;

app.get('/create' , (req, response) =>{
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const name = req.query.name;
    const querystr = `https://api.rawg.io/api/games?search=${name}`;
    axios.get(querystr).then(res =>{
        var ids = res.data.results[0].id;
        // if(ids == null){
        //     response.status(200).json("Not found");
        // }
        Index.find({id: ids}).then(db => {
            console.log(db.length)
            if(db.length !== 0){
                response.status(200).json("This game already exist in the database");
            }
            else{
                //Check the length of the genres array and write it into the array declared.
                /* START GENRE ARRAY COUNT */
                var count = res.data.results[0].genres.length;
                var i;
                for (i = 0; i < count; i++) {
                    genresArray[i] = res.data.results[0].genres[i].name;
                }
                /* END GENRE ARRAY COUNT */
                gameID  = res.data.results[0].id;
                gName   = res.data.results[0].name;

                const text = `https://api.rawg.io/api/games/${gameID}`;
                axios.get(text).then(res2 =>{
                    website = res2.data.website;
                    /* INSEART SEARCH RESULT INTO DATABASE */
                    axios({
                        url: "https://api-v3.igdb.com/games",
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'user-key': API_KEY
                        },
                        data: `search "${name}"; fields *; limit 1;`
                    }).then(resp3 => {
                        //console.log(response.data[0].summary);
                            const DB = new Index({
                                id                  :res.data.results[0].id,
                                name                :res.data.results[0].name,
                                rating              :res.data.results[0].rating,
                                release             :res.data.results[0].released,
                                cover               :res.data.results[0].background_image,
                                genres              :genresArray,
                                summary             :resp3.data[0].summary,
                                website             :res2.data.website
                            });
                            // START SAVING INTO DB //

                            if (!DB.id) {
                                response.status(200).json("Not Found");
                                console.log("5");
                                return;
                            }
                            DB.save().then(result =>{
                                response.status(200).json(result);
                            }).catch(err =>{
                                response.status(400).json(err);
                            })
                            //location.reload();
                            // END SAVING INTO DB // 
                        }).catch(err => {
                            console.error("4");
                        });                
                }).catch(err2 => {
                    console.log(err2);
                });
            }
        }).catch(err => {
            response.status(200).json(err);
        });
    }).catch(errree => {
        response.status(200).json("Not found");
    });
});


// app.get('/create', (req, res) =>{
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     const name = req.query.name;
//     const querystr = `https://api.rawg.io/api/games?search=${name}`;
//     axios.get(querystr).then(res =>{
//         //Check if data exist in database
//         var ids = res.data.results[0].id;
//         Index.find({id: ids}).then(dbres => {
//             if(dbres.length){
//                 console.log("This game already exist in database")
//                 res.status(200).json("This game already exist in the database");
//             }
//             else{
//                 //Check the length of the genres array and write it into the array declared.
//                 /* START GENRE ARRAY COUNT */
//                 var count = res.data.results[0].genres.length;
//                 var i;
//                 for (i = 0; i < count; i++) {
//                     genresArray[i] = res.data.results[0].genres[i].name;
//                 }
//                 /* END GENRE ARRAY COUNT */
//                 gameID  = res.data.results[0].id;
//                 gName   = res.data.results[0].name;

//                 const text = `https://api.rawg.io/api/games/${gameID}`;
//                 axios.get(text).then(res2 =>{
//                     website = res2.data.website;
//                     /* INSEART SEARCH RESULT INTO DATABASE */
//                     axios({
//                         url: "https://api-v3.igdb.com/games",
//                         method: 'POST',
//                         headers: {
//                             'Accept': 'application/json',
//                             'user-key': API_KEY
//                         },
//                         data: `search "${name}"; fields *; limit 1;`
//                     }).then(response => {
//                         //console.log(response.data[0].summary);
//                             const DB = new Index({
//                                 id                  :res.data.results[0].id,
//                                 name                :res.data.results[0].name,
//                                 rating              :res.data.results[0].rating,
//                                 release             :res.data.results[0].released,
//                                 cover               :res.data.results[0].background_image,
//                                 genres              :genresArray,
//                                 summary             :response.data[0].summary,
//                                 website             :res2.data.website
//                             });
//                             // START SAVING INTO DB //

//                             if (!DB.id) {
//                                 res.status(200).json("Not Found");
//                                 console.log("5");
//                                 return;
//                             }
//                             DB.save().then(result =>{
//                                 res.status(200).json(result);
//                             }).catch(err =>{
//                                 res.status(400).json(err);
//                             })
//                             //location.reload();
//                             // END SAVING INTO DB // 
//                         }).catch(err => {
//                             console.error("4");
//                         });                
//                 }).catch(err2 => {
//                     console.log(err2);
//                 });
//             }
//         }).catch(err => {
//             console.log("2");
//             //res.status(400).json("Game Already Exist in Database");
//         });
//     }).catch(error=>{
//         console.log("1");
//         res.status(400).json(error);
//     });
// });


// app.get('/getAllMovies', async (req,res)=> {
//     var a = await Index.find({})
//     res.send(a);
// });

app.get('/findgame', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const name = req.query.name;
    Index.find({ name: new RegExp(name, 'i') })
        .then(response => {
            res.status(200).json(response);
            console.log(response);
        }).catch(error => {
            res.status(400).json(error);
            console.log(error)
        });
});

//This function is to retrieve all games from database
app.get('/games',(req,res) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    Index.find({}).sort({'_id': -1}).then(response =>{
        res.status(200).json(response);
    }).catch(err =>{
        res.status(400).json(err);
    })
});

//This function is to delete game from Database
app.get('/delete', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const id = req.query.id;

    Index.deleteOne({id : `${id}`}).then(response => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(400).json(err);
    })
});

//This function is to update the game information in databse
app.get('/update' , (req,res) => {
    const id        = req.query.id;
    const text      = req.query.text;
    const genres    = req.query.genres;
    var genres1 = genres.split(",");

    Index.update({id:id} , {$set: {genres : genres1}, summary: `${text}` })
    .then(response =>{
        res.status(200).json(response);
    }).catch(err => {
        res.status(400).json(err);
    })
});

//This function is to search game in api
app.get('/findgameAPI', (req, res) => {
    const name = req.query.name;
    const querystr = `https://api.rawg.io/api/games?search=${name}`;

    axios.get(querystr).then(res =>{
        res.status(200).json(result.data);
    }).catch(error=>{
        res.status(400).json(error);
    });
});

app.listen(5000, ()=>{
    console.log('server listening on post 5000');
});

