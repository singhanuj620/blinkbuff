const 	express 			=	require('express'),
		ejs					=	require('ejs'),
		dotenv 				=	require('dotenv'),
		passport			=	require("passport"),
		mongoose			=	require('mongoose'),
		cookieSession 		=	require('cookie-session'),
		passportSetup		=	require("./config/passport-setup"),
		adminRoutes 		=	require("./routes/admin-routes"),
		userRoutes 			=	require("./routes/user-routes"),
		authRoutes 			=	require("./routes/auth-routes"),
		app					=	express();

dotenv.config();
app.set('view engine' , 'ejs');
app.use( express.static( "public" ) );
app.use(express.urlencoded({extended: false}));


app.use(cookieSession({
	maxAge: 24*60*60*1000,
	keys:[process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

const db_url=process.env.DB_URL;
mongoose.connect(db_url,{useUnifiedTopology:true, useNewUrlParser: true},() => {
	console.log('Connected to DB');
});

app.use("/admin",adminRoutes);
app.use("/user",userRoutes);
app.use("/auth",authRoutes);






app.get('/', (req,res) => {
	res.render('homepage',{user:req.user});
});





const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server is running on = '+port);
});