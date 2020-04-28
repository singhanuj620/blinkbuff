const 	router 			=	require('express').Router(),
		bodyParser		=	require('body-parser'),
		fs 				=	require('fs'),
		path			=	require('path'),
		formidable 		= 	require('formidable');
const Image	=	require('../models/image-model');
const Pending	=	require('../models/pending-model');


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
		let overall_length = Object.keys(items).length

		Pending.find().then((pend_items) => {
			let pend_length = Object.keys(pend_items).length
			res.render('adminprofile',{	user:req.user,
										images:items,
										len:overall_length,
										pend_images:pend_items,
										pend_len:pend_length
									});
		}).catch((err) => {
			console.log('Error in pending');
			console.log(err);
		});
	}).catch((err) => {
		console.log('Error in image collection');
		console.log(err);
	});
});

router.get('/uploadphoto',authAdminCheck,(req,res) => {
	res.render('adminupload',{user:req.user});
});

router.post('/submit',authAdminCheck,(req,res) => {
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
    	new Image({
				author:author,
				title:title,
			  	contentType:'jpg',
			  	size:0,
			  	image:null,
			  	img_url:new_url
			}).save().then((newImage) => {
				res.redirect('/admin/profile');
			}).catch((err) => {
				console.log("Error in adding in image collection");
				console.log(err);
			});
    }//if

    else{
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
			  	image:encode_image,
			  	img_url:null
			}).save().then((newImage) => {
				res.redirect('/admin/profile');
			}).catch((err) => {
				console.log("Error in adding in image collection");
				console.log(err);
			});
		}//end of files for loop

    }//else
    
	});
	// end of formidable
	// console.log('enddddd');
});

router.post('/accept/:id',authAdminCheck,(req,res) => {
	Pending.findByIdAndDelete({_id:req.params.id}).then((removed) => {
		// console.log(removed["author"]);
		new Image({
			title:removed["title"],
			author:removed["author"] ,
			contentType:removed["contentType"] ,
			size:removed["size"] ,
			image:removed["image"],
			img_url:removed["img_url"]
		}).save().then((added) => {
			// console.log('shifted');
			res.redirect('/admin/profile');
		}).catch((err) => {
			console.log('error while shifting');
		});
	}).catch((err) => {
		console.log(err);
	});
});

router.get('/*',(req,res) => {
	res.redirect('/error');
});

module.exports = router;