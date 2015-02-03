var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/rms2", {native_parser:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var resumes = require('./routes/resumes');
var authentication = require('./routes/authentication');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));


app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use(function(req, res, next){
    
    if(req.path == "/authentication/login"){
        next();
    }

    else if(req.session.user){
        next();
    }
    else{
        res.json('Not Authenticated', 401);

    }
});



app.use('/', routes);
app.use('/users', users);
app.use('/resumes', resumes);
app.use('/authentication', authentication);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// app.get('/resumes/:id', resumes.findById);
// app.post('/resumes', resumes.addResume);
// app.put('/resumes/:id', resumes.updateResume);
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
