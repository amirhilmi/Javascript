
var express = require('express');
var bodyParser=require('body-parser');
var config = require('./data.js');
var expressJWT= require('express-jwt');
var jwt =require('jsonwebtoken');
var mongo = require('mongodb');
var password = require('password-hash-and-salt');
var assert=require('assert');

var jwt_decode = require('jwt-decode');

var app = express();
var url="Put URL here";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressJWT({secret:new Buffer(config.password,'base64')}).unless({path:['/posLogin']}));


app.post('/posLogin', function (req, res) {
			var user=req.body.user;
			var pass=req.body.pass;

			if(!user)
			{
				//res.status(400).send('Username required');
				console.log("NO USERNAME!");
				res.send('{"status":2,"statusMsg":"Wrong username/password"}');
				return;
			}
			else if(!pass)
			{
				//res.status(400).send('Password missing');
				console.log("NO PASSWORD");
				res.send('{"status":2,"statusMsg":"Wrong username/password"}');
				return;
			}
			else if(pass.length<5)
			{
				console.log("PASSWORD TOO SHORT");
				//	console.log("USER",user,"PASS",pass);
				res.send('{"status":2,"statusMsg":"Wrong username/password"}');
				return;
			}
			else
			{
				//CHECK IF USER IS VALID
				var itemFind={username:user};
				mongo.connect(url,function(err,db)
				{
					assert.equal(null,err);
					db.collection('multipayusers').findOne(itemFind,function(err,result)
					{
						//	console.log("DB PASS",result);
						assert.equal(null,err);
						password(pass).verifyAgainst(result.password,function(error,verified){
							if(error)
							{
								// console.log("ERROR",error);
								res.send('{"status":2,"statusMsg":"Data unmatched"}');
							}
							if(!verified)
							{
								res.send('{"status":2,"statusMsg":"Wrong username/password"}');
							}
							else {
								//3. All ok, generate token
								console.log("AWESOME");
								var myToken=jwt.sign({username:user},new Buffer(config.rahsia,'base64'));
								res.send('{"status":1,"statusMsg":"Login Success!","token":"'+myToken+'","wcid":'+result.wcid+',"userEmail":"'+user+'"}');
							}

						});

						db.close();
					});
				});
			}
		});	

	




app.get('/readAllSales',function(req,res){
	// var custID=req.body.custID;

	functionPos.runAuthCheck(req.get('Authorization'),function(scotty){
	var parseScotty=JSON.parse(scotty);
	if(parseScotty.valid==0)
	{
	res.send('{"status":99, "msg":"Relogin Required"}');
	}
	else
	{
			//DO STUFF HERE
			// var elementStuff=[];
			// var x=0;

			mongo.connect(url,function(err,db){
		      assert.equal(null,err);//check if db error
					var sendBack=[];
					db.collection('multipaysales').find().count().then(function(daft){
						console.log("COUNT",daft);
						var counter=0;
						db.collection('multipaysales').find().forEach(function(datar){
								sendBack.push(datar);
								counter++;
							if(counter==daft)
							{
								res.send(sendBack);
								db.close();
							}
						});




					});
					// forEach(function(data){
					// 	res.write(data);
					// });
					// 	db.close();
					// });

		      })
			} 
		} );
	});
	



app.post('/CreateNewSale',function(req,res){
	
	functionPos.runAuthCheck(req.get('Authorization'),function(scotty)
		{
		var parseScotty=JSON.parse(scotty);
		if(parseScotty.valid==0)
		{
		res.send('{"status":99, "msg":"Relogin Required"}');
		}
		else
		{

			var salesData={
				user:req.body.user,
				method:req.body.method,
				time:req.body.time,
				amount:req.body.amount,
				transID:req.body.transID,
				status:req.body.status,
				notes:req.body.notes,
				shopID:req.body.shopID
			    }
				var sendPrinter=new Object();

				mongo.connect(url,function(err,db)
					{
					assert.equal(null,err);//check if db error
					db.collection('multipaysales').insert(salesData,function(err,result)
						{
						assert.equal(null,err);//check if db error
						
						//print receipt
						
						if(result.result.ok==1)
							{
							functionPos.salesPrint(parseScotty,salesData,function(sendPrinter)
							{
							res.send(sendPrinter);
							console.log (sendPrinter);
							}
							)}
						else
							{
							res.send('{"status":"0","msg":"Cannot Print Receipt"}');
							}
			
			// res.send('{"status":"1","msg":"Sale Done"}');
						db.close();
						})
			})
					 
							 
					 				
		};
	});
 });

		
app.post('/RemoveSale',function(req,res){
	functionPos.runAuthCheck(req.get('Authorization'),function(scotty){
		var parseScotty=JSON.parse(scotty);
		if(parseScotty.valid==0)
		{
		res.send('{"status":99, "msg":"Relogin Required"}');
		}
		else
		{
			var deleteSale={
				user:req.body.user,
				time:req.body.time,
				transID:req.body.transID
				
			}

			mongo.connect(url,function(err,db){
				assert.equal(null,err);//check if db error
				db.collection('multipaysales').deleteOne(deleteSale,function(err,result){
				  assert.equal(null,err);//check if db error
				  console.log(result);
				  res.send('{"status":"1","msg":"Sale Deleted"}');
				  db.close();
				})
			  })
			}
		});
	});


		




app.post('/UpdateSale',function(req,res){

	functionPos.runAuthCheck(req.get('Authorization'),function(scotty){
		var parseScotty=JSON.parse(scotty);
		if(parseScotty.valid==0)
		{
		res.send('{"status":99, "msg":"Relogin Required"}');
		}
		else
		{ 

			var UpdateSale={
				method:req.body.method,
				amount:req.body.amount,
				notes:req.body.notes
								
			};
			var SaleInfo={
				user:req.body.user,
				time:req.body.time,
				transID:req.body.transID
			};

			mongo.connect(url,function(err,db){
				assert.equal(null,err);//check if db error
				db.collection('multipaysales').updateOne(SaleInfo,{$set:UpdateSale},function(err,result){
				assert.equal(null,err);//check if db error
				console.log(result);
				res.send('{"status":"1","msg":"Sale Updated"}');
				db.close();
				})
			})
		}
	});

 });





	})

app.listen(8500, function () {

	console.log('TEST 8500!');
	//console.log("PRODUCTION ON PORT 8000");
 });
