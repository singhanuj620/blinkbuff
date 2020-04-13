const mongoose 		=	require('mongoose');
const Schema 		=	mongoose.Schema;

const userSchema = new Schema({
	username:String,
	googleid:String,
	thumbnail:String,
	role:String
});

const User = mongoose.model("users", userSchema);

module.exports = User;