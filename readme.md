#Electric or Not

###This app is built on Express.js in node.js and uses Mongo DB. It shows the users an electric car, and the user votes on whether or not they think it is "electric" or not. The vote is stored in a collection so that any user can go and see all votes for any car. 

#Home Page
	1. Get all pictures from MongoClient
		a. We did this when we connected.
	2. Get the current user from mongo
	4. Load all those documents into an array
	4B. Only load the photos the user hasn't voted on.
	5. Pick a random one
	6. Send the random one to the view (index.ejs)


	3. Find out which pictures the current user has NOT voted on
	6B. If, the user has voted on every image in the DB, notify them



#standings page
	1. Get all the photos.
	2. Sort them by the highest totals (negatives at the bottom)
	3. res.render the stanings view and pass it the sorted array
