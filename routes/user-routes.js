const router 	=	require('express').Router();

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


module.exports = router;