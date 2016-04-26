var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || 
				process.env.MONGOHQ_URL || 
				'mongodb://localhost:27017/electricOrNot';

var db;
var allPhotos;

MongoClient.connect(mongoUrl, function(error, database){
	database.collection('cars').find().toArray(function(error, result){
		allPhotos = result;
		db = database;
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // 1. Get all pictures from MongoClient
  	// We did this when we connected.

  // 2. Get the current user from mongo
  var currIP = req.ip;
  console.log("The current user's IP address is: " + currIP);
	db.collection('users').find({ip:currIP}).toArray(function(error, userResult){
		// IF the user result returns nothing, then the user hasn't voted on anything.
		if(userResult.length == 0){
			// 4. Load all those documents into an array
			photosToShow = allPhotos;
		}else{
			// 4. Only load the photos the user hasn't voted on.
			// res.send('You voted on something!!!!');
			photosToShow = allPhotos;
		}
		// 5. Pick a random one
		var randomNum = Math.floor(Math.random() * photosToShow.length);
		// 6. Send the random one to the view (index.ejs)
	  	res.render('index', { carimage: allPhotos[randomNum].imageSrc });

	});

  // 3. Find out which pictures the current user has NOT voted on
  // 6B. If, the user has voted on every image in the DB, notify them
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
	res.send("The user chose " + req.body.photo + " as a poser picture.");
  // 1. We know they voted electric, or they wouldn't be here.
  // 2. We know what they voted on, because we passed it in the req.body var
  // 3. We know who they are, because we know their ip.
  // 4. Update the users collection to include: user ip and photo they voted on
  // 5. Update the images/cars collection by -1	
  // 6. 
	// res.send(req.query.submit);
});


module.exports = router;





