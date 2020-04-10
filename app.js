const 	express 			=	require('express'),
		ejs					=	require('ejs'),
		dotenv 				=	require('dotenv'),
		app					=	express();

dotenv.config();
app.set('view engine' , 'ejs');
app.use( express.static( "public" ) );
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
	res.render('homepage');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server is running on = '+port);
});