const mongoose 		=	require('mongoose');
const Schema 		=	mongoose.Schema;

const imageSchema = new Schema({
	title:String,
	author:String,
	contentType:String,
	size:Number,
	image:String
});

const Image = mongoose.model("images", imageSchema);

module.exports = Image;