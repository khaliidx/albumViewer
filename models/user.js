
//user model
var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	facebook:{
		id: String,
		token: String,
		email:String,
		createdAt: { type: Date, default: Date.now },
		username: String,
		isAdmin: false
	}
});


userSchema.methods.name = function() {
	return this.facebook.username;
};


//exporting model
module.exports = mongoose.model("User", userSchema);