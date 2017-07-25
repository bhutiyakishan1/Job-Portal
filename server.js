var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({'extended':false}));
app.use(bodyParser.json());
var expressSession = require('express-session');
app.use(expressSession({secret:'kishan', saveUninitialized: false, resave: false}));



var mongoose = require('mongoose');
mongoose.connect('localhost:27017/MEAN');



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected to database!');
});


var Schema = mongoose.Schema;



var blogSchema = new Schema({

    username:   String,
    password:  String,
    email: String,
    location:   String,
    phone: Number,
    usertype: String,
    job:  [{ jobtitle: String, jobdescription: String, keywords: String, location: String }]
});

var Blog4 = mongoose.model('Blog4', blogSchema);

app.use(express.static(__dirname));


app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/index.html');
});

app.post('/postData',function(req,res){
    var item = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        location: req.body.location,
        phone: req.body.phone,
        usertype: req.body.usertype

    };

    Blog4.findOne({ username: item.username, email: item.email}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if(!doc){
            var data = new Blog4(item);
            data.save();
            res.json({A: "yes"});
        }
        else{
            console.error('username and email already exist');
            res.json({A: "no"})
        }
    });
});


app.post('/login',function(req,res){
    var item = {
        username: req.body.username,
        password: req.body.password
    };

    Blog4.findOne({ username: item.username, password: item.password}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if(!doc){
            console.log('wrong password');
            res.json({A: "wrong"});
        }
        else{
            console.log('login successful');
            req.session.user = item.username;
            console.log(req.session.user);
            res.json({A: "correct"})
        }
    });
});

app.post('/checkLogin', function (req, res) {
    if (!req.session.user)
        res.json({isLogin: "no"});
    else
        res.json({isLogin: "yes"});
});

app.post('/checkUserType', function(req, res){
    Blog4.findOne({ username: req.session.user }, function (err, doc) {
        if(err)
            console.log(err);
        res.json({usertype: doc.usertype, username: req.session.user});
    });
});

app.post("/getJobs", function (req, res) {
    var query = Blog4.find().select('job');
    query.exec(function (err, someValue) {
        if (err) return next(err);
        var messages = []; var k = 0;
        for(i =0 ; i < someValue.length; i++)
        {
            for(j=0; j < someValue[i].job.length; j++)
            {
                messages[k] = someValue[i].job[j];
                k++;
            }
        }
        res.json(messages);
    });
});

app.post('/resetSession', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
});

app.post('/update',function(req,res) {
    var item = {
        jobtitle: req.body.jobtitle,
        jobdescription: req.body.jobdescription,
        keywords: req.body.keywords,
        location: req.body.location
    };


    Blog4.findOne({ username: req.session.user}, function(err, doc) {
        if (err) {
            console.error('error, no entry found');
        }
        doc.job.push(item);
        doc.save();
    });
    res.send(200);
});

app.listen('8000', function(){
    console.log('server is listening on port 8000');
});

//routeHandler(app);