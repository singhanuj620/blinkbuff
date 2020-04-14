const 	router 			=	require('express').Router();
const 	passport		=	require("passport");



router.get("/google",passport.authenticate('google',{
	scope: ['profile']
}));

router.get("/google/redirect",passport.authenticate('google'), (req,res) => {
	res.redirect('/auth/rolecheck');
});

router.get('/rolecheck',(req,res) => {
	if(req.user){
		if(req.user.role=='admin'){
			res.redirect('/admin/profile');
		}
		else{
			res.redirect('/user/uploadphoto');
		}
	}
	else{
		res.redirect('/user/login');
	}
})


router.get('/*',(req,res) => {
	res.redirect('/error');
});


module.exports = router;