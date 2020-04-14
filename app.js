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
		deleteRoutes		=	require("./routes/delete-routes"),
		bodyParser			=	require('body-parser'),
		methodOverride		=	require('method-override'),
		fs 					=	require('fs'),
		path				=	require('path'),
		formidable 			= 	require('formidable'),
		app					=	express();
const Image	=	require('./models/image-model');

dotenv.config();
app.set('view engine' , 'ejs');
app.use( express.static( "public" ) );
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

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
app.use("/delete",deleteRoutes);


app.get('/', (req,res) => {
	res.render('homepage',{user:req.user});
});


app.get('/error', (req,res) => {
	res.render('errorpage',{user:req.user});
});

app.get("/logout", (req,res) => {
	req.logout();
	res.redirect("/user/login");
});

app.get('/collections',(req,res) => {
	Image.find().then((items) => {
		let overall_length = Object.keys(items).length
		res.render('collections',{user:req.user,images:items,len:overall_length});
	});
});

app.get('/*',(req,res) => {
	res.redirect('/error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server is running on = '+port);
});