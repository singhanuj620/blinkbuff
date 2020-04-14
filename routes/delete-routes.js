const 	router 			=	require('express').Router(),
		bodyParser		=	require('body-parser'),
		formidable 		= 	require('formidable');
		methodOverride	=	require('method-override');
const Image	=	require('../models/image-model');
const Pending	=	require('../models/pending-model');
router.use(bodyParser.urlencoded({extended:true}));
router.use(methodOverride('_method'));


router.delete('/pending/:id',(req,res) => {
		// console.log(req.params.id);
	Pending.findByIdAndDelete({_id:req.params.id}).then((removed) => {
		res.redirect('/admin/profile');
	}).catch((err) => {
		console.log(err);
	});
});

router.delete('/images/:id',(req,res) => {
	Image.findByIdAndDelete({_id:req.params.id}).then((removed) => {
		res.redirect('/admin/profile');
	}).catch((err) => {
		console.log(err);
	});
});

router.get('/*',(req,res) => {
	res.redirect('/error');
});


module.exports = router;