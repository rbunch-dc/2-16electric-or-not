var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
 var mongoUrl =
    process.env.process.env.MONGODB_URI ||
    process.env.process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017/electric';

var db;
//Create a connection to the db, and assign to the global db var
MongoClient.connect(mongoUrl, function(error, database){
	db = database;
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var currIP = req.ip;
	db.collection('users').find({ip:currIP}).toArray(function(error, userResult){
		var photosVoted = [];
		for(i=0; i<userResult.length; i++){
			photosVoted.push(userResult[i].image);
		}

		db.collection('cars').find({imageSrc: {$nin: photosVoted}}).toArray(function(error, photosToShow){
			if(photosToShow.length == 0){
				//this means the user has voted on every image we have available. Send them to the standings page.
				res.redirect('/standings');
			}else{
				//There are still photos to vote on. So server one up.
				var randomNum = Math.floor(Math.random() * photosToShow.length);
			  	res.render('index', { carimage: photosToShow[randomNum].imageSrc });
			}

		});
	});
});

router.get('/standings', function(req, res, next){

	db.collection('cars').find().toArray(function(error, result){
		standingsArray = [];
		for(i=0; i<result.length; i++){
			standingsArray.push(result[i]);
		}
		standingsArray.sort(function(a,b){
			return (b.totalVotes - a.totalVotes);
		})
		res.render('standings', {theStandings: standingsArray});
	});

});

/* Set up the post electric page. */
router.post('/electric', function(req, res, next){
	// 1. We know they voted electric, or they wouldn't be here.
	// 2. We know what they voted on, because we passed it in the req.body var
  	// 3. We know who they are, because we know their ip.

	// 4. Update the users collection to include: user ip and photo they voted one
	db.collection('users').insertOne({
		ip: req.ip,
		vote: 'electric',
		image: req.body.photo
	});

  	// 5. Update the images/cars collection "totalVotes" for this particular car, by 1 (because they chose electric)
  	db.collection('cars').find({imageSrc:req.body.photo}).toArray(function(error, result){
  		if(isNaN(result[0].totalVotes)){
  			total = 0;
  		}else{
  			total = result[0].totalVotes;
  		}
		db.collection('cars').updateOne(
			{ imageSrc: req.body.photo },
			{
				$set: {"totalVotes": (total + 1)}
			}, function(error, results){
				// console.log(results);
				// console.log(newTotal);
			}
		);
  	});
  	// 6. Send them back to the main page so they can vote again (OR render a page)
  	// Instead of simply sending the user back to the home page, you could
  	// res.render an ejs file, that has a picture of that car
  	// with the total votes

	res.redirect('/');
  
});

/* Set up the post electric page. */
router.post('/poser', function(req, res, next){
	// res.send(req.body);
	// res.send("The user chose " + req.body.photo + " as a poser picture.");
  // 1. We know they voted electric, or they wouldn't be here.
  // 2. We know what they voted on, because we passed it in the req.body var
  // 3. We know who they are, because we know their ip.
  // 4. Update the users collection to include: user ip and photo they voted on
	db.collection('users').insertOne({
		ip: req.ip,
		vote: 'poser',
		image: req.body.photo
	});  
  // 5. Update the images/cars collection by -1	
  // 6. 
  	db.collection('cars').find({imageSrc:req.body.photo}).toArray(function(error, result){
  		if(isNaN(result[0].totalVotes)){
  			total = 0;
  		}else{
  			total = result[0].totalVotes;
  		}
		db.collection('cars').updateOne(
			{ imageSrc: req.body.photo },
			{
				$set: {"totalVotes": (total - 1)}
			}, function(error, results){
				// console.log(results);
				// console.log(newTotal);
			}
		);
  	});  
	res.redirect('/');
});


module.exports = router;





