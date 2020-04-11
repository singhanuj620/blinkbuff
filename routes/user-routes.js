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



router.get('/login',(req,res) => {
	if(req.user){
		res.redirect('/user/profile',{user:req.user});
	}
	else{
		res.render('login',{user:req.user});
	}
});

router.get('/profile',authCheck,(req,res) => {
	res.render('userprofile',{user:req.user});
});


router.get("/logout", (req,res) => {
	req.logout();
	res.redirect("/user/login");
});


module.exports = router;