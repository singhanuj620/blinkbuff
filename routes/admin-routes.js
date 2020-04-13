const 	router 			=	require('express').Router(),
		bodyParser		=	require('body-parser'),
		fs 				=	require('fs'),
		path			=	require('path'),
		formidable 		= 	require('formidable');
const Image	=	require('../models/image-model');


const authAdminCheck = (req,res,next) => {
	if(!req.user){
		// if user is not logged in
		res.redirect("/user/login");
	}
	else{
		// user is loggerd in
		if(req.user.role=='admin'){
			next();
		}
		else{
			res.redirect('/auth/rolecheck');
		}
	}
}


// router.get('/', (req,res) => {
// 	res.render('adminlogin');
// });

router.get('/profile',authAdminCheck,(req,res) => {
	Image.find().then((items) => {
		let coll_length = Object.keys(items).length
		res.render('adminprofile',{user:req.user, images:items, len:coll_length});
	}).catch((err) => {
		console.log(err)
	});
});

router.get('/uploadphoto',(req,res) => {
	res.render('adminupload',{user:req.user});
});

router.post('/submit',(req,res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (err,fields ,files) => {
    if (err) {
      console.error('Error while parsing form using formidable', err)
      throw err
    }
    // console.log('Fields', fields)
    const author = fields["author"];
    const title = fields["title"];

    // console.log('Files', files)

    for (const file of Object.entries(files)) {
     	// console.log(file[1]);
     	const img=file[1]
     	const i = fs.readFileSync(img.path);
	  	const encode_image=i.toString('base64');
		// console.log(data)
		new Image({
			author:author,
			title:title,
		  	contentType:img.type,
		  	size:Math.round((img.size)/1024),
		  	image:encode_image
		}).save().then((err,newImage) => {
			if(err){
				res.redirect('/error');
			}
			res.redirect('/admin/profile');
		});
		}//end of files for loop
	});
	// end of formidable
	
});


module.exports = router;