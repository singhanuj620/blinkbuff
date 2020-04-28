const 	router 			=	require('express').Router();
		bodyParser		=	require('body-parser'),
		fs 				=	require('fs'),
		path			=	require('path'),
		formidable 		= 	require('formidable');
const Pending	=	require('../models/pending-model');

const authUserCheck = (req,res,next) => {
	if(!req.user){
		// if user is not logged in
		res.redirect("/user/login");
	}
	else{
		// user is loggerd in
		if(req.user.role=='guest'){
			next();
		}
		else{
			res.redirect('/auth/rolecheck');
		}
	}
}



router.get('/login',(req,res) => {
	if(req.user){
		res.redirect('/auth/rolecheck');
	}
	else{
		res.render('login',{user:req.user});
	}
});

router.get('/profile',authUserCheck,(req,res) => {
	res.render('userprofile',{user:req.user});
});

router.get('/uploadphoto',authUserCheck,(req,res) => {
	res.render('userupload',{user:req.user});
});

router.post('/submit',authUserCheck,(req,res)=> {
	const form = new formidable.IncomingForm();
	form.parse(req, (err,fields ,files) => {
    if (err) {
      console.error('Error while parsing form using formidable', err)
      throw err
    }
    // console.log('Fields', fields)
    const author = fields["author"];
    const title = fields["title"];

    if(fields["img_url"]){
    	let old_url = fields["img_url"]
    	let new_url = old_url.replace("drive.google.com/open?", "drive.google.com/uc?");
    	new Pending({
				author:author,
				title:title,
			  	contentType:'jpg',
			  	size:0,
			  	image:null,
			  	img_url:new_url
			}).save().then((newImage) => {
				res.redirect('/user/thankyou');
			}).catch((err) => {
				console.log("Error in adding in image collection");
				console.log(err);
			});
    }//if

    // console.log('Files', files)
	else{
    	for (const file of Object.entries(files)) {
     	// console.log(file[1]);
	     	const img=file[1]
	     	const i = fs.readFileSync(img.path);
		  	const encode_image=i.toString('base64');
			// console.log(data)
			new Pending({
				author:author,
				title:title,
			  	contentType:img.type,
			  	size:Math.round((img.size)/1024),
			  	image:encode_image,
			  	img_url:null
			}).save().then((newImage) => {
				res.redirect('/user/thankyou');
			}).catch((err) => {
				console.log("Error in adding in image collection");
				console.log(err);
			});
		}//end of files for loop

    }//else
	});
	// end of formidable
});

router.get('/thankyou',authUserCheck,(req,res) => {
	res.render('userthankyou',{user:req.user});
});


router.get('/*',(req,res) => {
	res.redirect('/error');
});

module.exports = router;