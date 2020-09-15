module.exports = function MongoDBService(instance) {
	// var url = "mongodb+srv://mydb:db_pass@cluster0-cllr9.mongodb.net/GlobalDB?retryWrites=true&w=majority"
	var self = this,
	client 	= require("mongodb").MongoClient,
	mongo 			= require("mongodb"),
	mongoConnection = null,
	dbName 			= "";

	function initialise(cb) {
		dbName =  instance.getSharedData("appConfig").dbName;
		getConnectinon(cb);
		// cb(null,true)
	}

	function getConnectinon(cb) {
		if(mongoConnection){
			cb(null,true);
			return;
		}
		// let connection =   client("mongodb://localhost:27017",{ useUnifiedTopology: true })
			
		// connection.connect(err => {
		//   if(err){
		// 	console.log('---connection error--',err);

		//   }
		//   mongoConnection = connection.db("GlobalDB")
		//   cb(null, true);
		// });
		
			// connection.connect(function(err,mongoC){
			// 	if(err){
			// 		cb(err,null);
			// 		return
			// 	}
			// 	cb(null, true);
			// })
		// });

		client.connect(
			"mongodb://localhost:27017",
			{ useUnifiedTopology: true },
			(err, res) => {
				if (err) {
					console.log("----- error while connecting to db--", err);
					cb(err, null);
					return;
				}
				console.log("-------- db connected-------");
				mongoConnection = res.db(dbName);
				 // = mongoConnection.db(dbName)
				cb(null, true);
			}
		);
	}

	function save(collection, data, cb) {
		
		getConnectinon(function (err, res) {
			mongoConnection.collection(collection).insertOne(data, (err, res) => {
				if (err) {
					cb(err, null);
					return;
				}
				delete res.connection;
				delete res.message;
				cb(null, res);
			});
		});
	}

	function find(collection, query, optionQuery, cb) {
		
		getConnectinon(function (err, res) {

			mongoConnection.collection(collection).find(query, { projection: optionQuery }).toArray(function (err, res) {
				if (err) {
					cb(err, null);
					return;
				}
				cb(null, res);
			});
		});
	}

	function findOne(collection, query, optionQuery, cb) {
		
		getConnectinon(function (err, res) {

			mongoConnection.collection(collection).findOne(query, { projection: optionQuery }, function (err, res) {
				if (err) {
					cb(err, null);
					return;
				}
				cb(null, res);
			});
		});
	}

	function update(collection, query, data, option, cb) {
		
		getConnectinon(function (err, res) {

			mongoConnection.collection(collection).update(query, data, option, (err, res) => {
				if (err) {
					cb(err, null);
					return;
				}
				delete res.connection;
				delete res.message;
				cb(null, res);
			});
		});
	}

	function findOneAndUpdate(collection, query, data, option, cb) {
		
		getConnectinon(function (err, res) {
			mongoConnection.collection(collection).findOneAndUpdate(query, data, option, (err, res) => {
				if (err) {
					cb(err, null);
					return;
				}
				delete res.connection;
				delete res.message;
				cb(null, res);
			});
		});
	}

	this.initialise = initialise;
	this.save = save;
	this.find = find;
	this.findOne = findOne;
	this.update = update;
	this.findOneAndUpdate = findOneAndUpdate;
};
