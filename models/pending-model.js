const mongoose 		=	require('mongoose');
const Schema 		=	mongoose.Schema;

const pendingSchema = new Schema({
	title:String,
	author:String,
	contentType:String,
	size:Number,
	image:String
});

const Pending = mongoose.model("pendings", pendingSchema);

module.exports = Pending;