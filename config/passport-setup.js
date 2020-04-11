const passport 		=	require("passport");
const GoogleStrategy=	require("passport-google-oauth20");
const dotenv 		=	require("dotenv");
const User 			=	require('../models/user-model');

dotenv.config();

passport.serializeUser((user,done) => {
	done(null,user.id);
});

passport.deserializeUser((id,done) => {
	User.findById(id).then((user)=>{
		done(null,user);
	})
});

passport.use(
	new GoogleStrategy({
		//option for strategy
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL:"/auth/google/redirect"
	}, (accessToken, refreshToken, profile, done) => {
		//callback function
		User.findOne({googleid: profile.id}).then((currentUser) => {
			if(currentUser){
				// console.log('user is : ',currentUser);
				done(null,currentUser);
			}
			else{
				// console.log(profile);
				new User({
					username: profile.displayName,
					googleid: profile.id,
					thumbnail: profile._json.picture,
					role:"guest",
					image:[]
				}).save().then((newUser) => {
						// console.log('newUser created : ',newUser);
						done(null, newUser);
					});
			}
		});
	})
)