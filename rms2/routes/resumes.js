var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var _ = require('underscore'),
     AWS = require('aws-sdk'),
     fs = require('fs'),
     flow = require('flow');
 AWS.config.loadFromPath(__dirname + '/../config.json');

var mongo = require('mongodb');

var BSON = mongo.BSONPure;


// <!--All Candidate List(Find All) API-->
router.get('/list', function(req, res) {
	
	var db = req.db;
	db.collection('userslist').find().toArray(function(err,docx){
		res.json(docx);
	});
});

// <!--Search By Name API-->
router.get('/search/:term', function(req, res) {
  var db = req.db;
  var term = req.params.term;
  console.log(term);

  var nameRegEx = /^[a-zA-Z]+$/;
  var emailRegEx = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  var numberRegEx = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
  
  var type = 'name';

	  if(emailRegEx.exec(term)){
	  		type = 'email';
		}
	  else if(numberRegEx.exec(term)){
		  	type = 'mobile';
		}
		console.log(type);

	  	if(type == 'email'){
				db.collection('userslist').find({"emailaddress": new RegExp('^'+term,'i')}).toArray(function(err, resumes) {
					if(!err){
					
						res.json(resumes);
						
					}else{
						res.json(500, 'Error. Please try after some time');
					}
				});
		}else if(type == 'mobile'){
				db.collection('userslist').find({"mobile": term}).toArray(function(err, resumes) {
					if(!err){
					
						res.json(resumes);
					
					}else{
						res.json(500, 'Error. Please try after some time');
					}
				});
		}else{
				db.collection('userslist').find({"firstname":new RegExp('^'+term,'i')}).toArray(function(err, resumes) {
					if(!err){
					
						res.json(resumes);
					
					}else{
						res.json(500, 'Error. Please try after some time');
					}
				});
		}
  
});


// <!--ADD Candidate API-->
router.post('/add', function(req, res) {

	var firstNameRegEx = /^[a-zA-Z]+$/; 
	var lastNameRegEx = /^[a-zA-Z]+$/;
	var emailRegEx = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
	var numberRegEx = /^((0091)|(\+91)|0?)[789]{1}\d{9}$/;

	if( firstNameRegEx.test(req.body.firstname) && lastNameRegEx.test(req.body.lastname)  && emailRegEx.test(req.body.emailaddress) && numberRegEx.test(req.body.mobile)){
	var db = req.db; 
	var form ={};
	form.firstname = req.body.firstname,
	form.middlename= req.body.middlename,
	form.lastname = req.body.lastname,
	form.age = req.body.age,
	form.gender = req.body.gender,
	form.emailaddress = req.body.emailaddress,
	form.exp = req.body.exp,
	form.dob = req.body.dob,
	form.status = req.body.status,
	form.comment = req.body.comment,
	form.mobile = req.body.mobile,
	form.Date_of_interview = req.body.Date_of_interview;
	

	var basedata = req.body.file.file;
	var n = basedata.lastIndexOf(',');
	var data = basedata.substring(n+1);
	var ext = req.body.file.ext;

	form.ext = ext;
	
    console.log('Adding Resume: ' + JSON.stringify(form));
    db.collection('userslist').find({"emailaddress":req.body.emailaddress}).toArray(function(err, resumes) {
			if(!err){ 
				if(resumes && resumes.length > 0){
					res.json(400, 'Resume with this email already exists. Please edit the existing resume');
				}else{
					var document = req.body.document;
					delete req.body['document'];
					req.body["created_date"] = new Date();
					db.collection('userslist').insert(form, {safe:true}, function(err, result) {
			            if (err) {
			                res.send({'error':'An error has occurred'});
			            } else {
			            	var id = form._id;
			            	console.log(id);
			                console.log('Success: ' + JSON.stringify(result[0]));

			                s3(data,id,ext,function(response){

			                	res.send(result[0]);

			                });

			            // });
			        }

	        		});
        		}
    		}else{
    			res.json(500, 'Error. Please try after some time');
    		}
    		
   		 });
	}
});

// <!--FindById API-->
router.get('/:id', function(req, res) {
	
	var db = req.db;
    var id = req.params.id;
    console.log('Retrieving Candidate Details: ' + id);
    db.collection('userslist', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
});


/*Update API*/
router.put('/:id', function(req, res) {
	var db = req.db;
    var id = req.params.id;
    // var resume = req.body;
    var form ={};
	form.firstname = req.body.firstname,
	form.middlename= req.body.middlename,
	form.lastname = req.body.lastname,
	form.age = req.body.age,
	form.gender = req.body.gender,
	form.emailaddress = req.body.emailaddress,
	form.exp = req.body.exp,
	form.dob = req.body.dob,
	form.status = req.body.status,
	form.comment = req.body.comment,
	form.mobile = req.body.mobile,
	form.Date_of_interview = req.body.Date_of_interview;
    var basedata = req.body.file.file;
	var n = basedata.lastIndexOf(',');
	var data = basedata.substring(n+1);
	var ext = req.body.file.ext;
	form.ext = ext;
    delete form._id;
    
    console.log('Updating candidate Details: ' + id);
    db.collection('userslist', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, form, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating Details: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                s3(data,id,ext,function(response){

			        res.send(result[0]);

			     });

               
            }
        });
    });
});

/*Delete By ID API*/
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    console.log('Deleting Resume: ' + id);
    db.collection('userslist', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + 'document(s) deleted');
                res.send(req.body);
            }
        });
    });
});

/*Filter Search by Status API*/
router.get('/status/:filter', function(req, res) {
	  var db = req.db;
	  var filter = req.param('filter');
	  console.log(req.params);


	  var statusRegEx = /^[a-zA-Z]+$/;

	  console.log(filter);
	  if(statusRegEx.exec(filter)){
	  	type = 'status';
	  } else {}
	 //  	
		console.log(type);

	  	if(type == 'status'){
			db.collection('userslist').find({"status":filter}).toArray(function(err, resumes) {
				if(!err){
				
					res.json(resumes);
				
				}else{
					res.json(500, 'Error. Please try after some time');
				}
			});
		}
		else{
			res.json(500, 'Error. Please try after some time');
		}
  
});

/*Filter Search API*/
	router.get('/filterResumes/:obj', function(req ,res){
	var db = req.db;
	var obj = req.param('obj');

	obj = JSON.parse(obj);
	var start = obj.startDate;
	var end = obj.endDate;
	var candidateStatus = obj.c_status;
  
	db.collection('userslist').find({status: candidateStatus}).toArray(function(err, resumes){
		
		if(!err){

			var from = new Date(start);
			var to = new Date(end);

			console.log(from);
			console.log(to);

			var result = [];
			for(var i=0; i<resumes.length; i++){
				var interviewDate = new Date(resumes[i].Date_of_interview);
				// console.log(resumes[i]);
				if(interviewDate >= from && interviewDate <= to){
					result.push(resumes[i]);
				}
			}
			res.json(result);
		}else{
			res.json(500, 'Error. Please try after some time');
		}
	});

});


// <!--Multiple Delete API-->
router.get('/delete/:ids', function(req, res) {
	// console.log('here');
	console.log(req.params.ids);
	var ids =req.params.ids;
		 ids = JSON.parse(ids);
    var db = req.db;
    var resumes=req.body;
   
    console.log('Deleting Resume: ' +ids);
    db.collection('userslist', function(err, collection) {
    	for(var i=0; i< ids.length; i++){
    	 	console.log(ids[i]);
		        collection.remove({'_id':new BSON.ObjectID(ids[i])}, {safe:true}, function(err, result) {
		            if (err) {
		                // res.send({'error':'An error has occurred - ' + err});
		            } else {
		    
		                console.log('' + result + 'document(s) deleted');
		                // // res.send(req.body);
		            }
		        });
		}
		  res.json(200);
    });

});

s3 = function(data, id, ext, res) {

     var s3 = new AWS.S3(),
         result = {
            error : 0,
            uploaded : []
         };
     
     var buffer = new Buffer(data, 'base64');
     s3.putObject({
     			 ACL: 'public-read',
                 Bucket: 'mrms', //Bucket Name
                 Key: 'resumes/'+id+ext, //Upload File Name, Default the original name
                 Body: buffer
     			}, function(err, data) { //Upload Callback
                if(err) {
                     console.dir('Error : ' + err);
                     result.error++;
                }
                else{

                 	if(result.uploaded.push(data)){
                 		res('sucessfull');
                 	}else{
                 		res('error');
                 	}

                }
    });

};


module.exports = router;


