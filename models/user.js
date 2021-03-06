var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback){
	var user = {
		name: this.name,
		password: this.password,
	};
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('name', {unique: true});
		    collection.insert(user, {safe: true}, function(err, user){
			mongodb.close();
			callback(err, user);
		    });
		});
	});
};

User.update = function update(username, password, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.updateOne({name:username}, {$set:{password: password}});
			mongodb.close();
			callback(null);
		});
	});
}

User.del = function del(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.deleteOne({name: username}, function(err, doc){
				mongodb.close();
				callback(err);
			});
		});
	});
};

User.get = function get(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name: username}, function(err, doc){
				mongodb.close();
				if(doc){
					var user = new User(doc);
					callback(err, user);
				}else{
					callback(err, null);
				}
			});
		});
	});
};

User.getallu = function getallu(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			
			var query = {};
			if (username){
				query.user = username;
			}
			collection.find(query).sort({_id: -1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					callback(err, null);
				}
				var users = [];
				docs.forEach(function(doc, index){
					var user = new User(doc);
					users.push(user);
				});
				callback(null, users);
			});
		});
	});
};



















