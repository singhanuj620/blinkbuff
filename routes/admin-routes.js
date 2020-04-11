const router 	=	require('express').Router();

const authCheck = (req,res,next) => {
	if(!req.user){
		// if user is not logged in
		res.redirect("/user/login");
	}
	else{
		// user is loggerd in
		next();
	}
}


// router.get('/', (req,res) => {
// 	res.render('adminlogin');
// });

router.get('/profile',authCheck,(req,res) => {
	res.render('userprofile',{user:req.user});
});


module.exports = router;