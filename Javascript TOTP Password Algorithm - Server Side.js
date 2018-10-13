//RHINO ADMIN
//Leopard CUSTOMER STUFF
var express = require('express');
var bodyParser=require('body-parser');
var config = require('./data.js');
var expressJWT= require('express-jwt');
var jwt =require('jsonwebtoken');
var mongo = require('mongodb');
var password = require('password-hash-and-salt');
var assert=require('assert');
var functionPos=require('./function.js')
var jwt_decode = require('jwt-decode');
var secure = require('./secure.js')
var forge = require('node-forge');
var jsSHA = require('jssha');

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressJWT({secret:new Buffer(config.rahsia,'base64')}).unless({path:['/login','/mlogin']}));

var WooCommerceAPI = require('woocommerce-api');

var test12="test12";




app.post('/login', function (req, res) 
	{
		secure.decryptLogin(req.get('encryptedLogin'), function (decodedLogin) //Decrypt Login Data at secure.js
			{
				var listofChars=decodedLogin.split("&");
				var user=listofChars[0];
				var pass=listofChars[1];	

				if(!user)
					{
						//res.status(400).send('Username required');
						console.log("NO USERNAME YO!");
						res.send('{"status":2,"statusMsg":"Wrong username/password"}');
						return;
					}
				else if(!pass)
					{
						//res.status(400).send('Password missing');
						console.log("NO PASSWORD YO!");
						res.send('{"status":2,"statusMsg":"Wrong username/password"}');
						return;
					}
				else if(pass.length<5)
					{
						console.log("PASSWORD TOO SHORT YO");
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
								db.collection('puffuser').findOne(itemFind,function(err,result) //Open Username database
									{
										if(err)
											{
												res.send('{"status":2,"statusMsg":"Data unmatched"}'); 
											}

										else if (!result)
											{
												//Send res when username not available in DB
												res.send('{"status":2,"statusMsg":"Wrong username/password"}');
											}

										else 
											{
												//Username Matched with DB, checked password
												console.log("Cool Username");

												assert.equal(null,err);
												password(pass).verifyAgainst(result.password,function(error,verified)
													{
														if(error)
															{
																// console.log("ERROR",error);
																res.send('{"status":2,"statusMsg":"Data unmatched"}');
															}
														if(!verified)
															{
																res.send('{"status":2,"statusMsg":"Wrong username/password"}');
															}
														else 
															{
																//3. All ok, generate token
																console.log("AWESOME");
																var myToken=jwt.sign({username:user},new Buffer(config.rahsia,'base64'));
																res.send('{"status":1,"statusMsg":"Login Success!","token":"'+myToken+'","wcid":'+result.wcid+',"userEmail":"'+user+'"}');
															}

													}
												);
											}

										db.close();
							// });
									});
								});
	 				}
   			})
	});


app.post('/mlogin', function (req, res) {
				var user=req.body.user;
				var pass=req.body.pass;

				if(!user)
				{
					//res.status(400).send('Username required');
					console.log("NO USERNAME ");
					res.send('{"status":2,"statusMsg":"Wrong username/password"}');
					return;
				}
				else if(!pass)
				{
					//res.status(400).send('Password missing');
					console.log("NO PASSWORD ");
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
						db.collection('puffuser').findOne(itemFind,function(err,result)
						{
							//	console.log("DB PASS",result);
							// console.log("ISMANAGER",result.isManager);
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
								else
								{
									//3. check if manager or not
									if(result.isManager!=1)
									{
										res.send('{"status":2,"statusMsg":"Sorry, please use a manager login}');
									}
									else
									{
										//4.else awesome
										console.log("AWESOME");
										var myToken=jwt.sign({username:user},new Buffer(config.rahsia,'base64'));
										res.send('{"status":1,"statusMsg":"Login Success!","token":"'+myToken+'","userEmail":"'+user+'"}');
									}

								}

							});

							db.close();
						});
					});
				}

		});




app.get('/getwcid', function (req, res) {



	})

app.listen(8100, function () {

	console.log('TEST 8100!');
	//console.log("PRODUCTION ON PORT 8000");
 });


