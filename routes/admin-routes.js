const router 	=	require('express').Router();

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
	res.render('adminprofile',{user:req.user});
});


module.exports = router;