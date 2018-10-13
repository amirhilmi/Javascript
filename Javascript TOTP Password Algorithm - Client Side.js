var express = require('express');
var bodyParser=require('body-parser');
var config = require('./data.js');
var expressJWT= require('express-jwt');
var jwt =require('jsonwebtoken');
var mongo = require('mongodb');
var password = require('password-hash-and-salt');
var assert=require('assert');
var funky=require('./function.js')
var jwt_decode = require('jwt-decode');

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));


var WooCommerceAPI = require('woocommerce-api');


var forge = require('node-forge');
var jsSHA = require('jssha');



//Generate encypted Login Data
app.get('/masuk', function (cipher, res) {

    //Get Time
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = leftpad(dec2hex(Math.floor(epoch / 300)), 16, "0"); //Divide Time by 300 (set validity period), convert to hex, add padding
    console.log("time at client", time);

    //Generate Random Num and Convert To Hex
    var randomNumDec=Math.round(Math.random()*10000000000);
    console.log("RANDOM NUMBER Dec",randomNumDec);
    var randomNum=dec2hex(randomNumDec);
    console.log("RANDOM NUMBER Hex",randomNum);

    //Combine and Shuffle
    var string = (randomNum)+'$'+(time);  //Add separator between Time and RandomNum
    console.log("Random + Time",string);
    var sprauchle=shuffle(string, 4);     //randomnly shuffle
    console.log("Shuffled ",sprauchle);


     
    var salt = forge.random.getBytesSync(128); //generate salt to be used in key
    var key = forge.pkcs5.pbkdf2(time, salt, 40, 16); //generate key based on time and salt, used in creating cipher

    var iv = forge.random.getBytesSync(16);

    var cipher = forge.cipher.createCipher('AES-CBC', key); //create cipher data based on key
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer("razmans@gmail.com&123123tipu")); //password Text 
    cipher.finish();
    var cipherText = forge.util.encode64(cipher.output.getBytes()); //encoded cipher data to be sent to server

    var loginEncrypted = {
    cipherEncoded:cipherText,
    saltEncoded:forge.util.encode64(salt),
    ivEncoded:forge.util.encode64(iv),
    sprauchleEncoded:forge.util.encode64(sprauchle),
    
    };
                                                                                                                                                                                      

    console.log(loginEncrypted);
    res.send(loginEncrypted);
    });


//Constant 
    var dec2hex = function(s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
        };

    var hex2dec = function(s) {
        return parseInt(s, 16);
    };

    var leftpad = function(s, l, p) {
        if(l + 1 >= s.length) {
        s = Array(l + 1 - s.length).join(p) + s;
        }
     return s;
    };

    const split = (text) => {
        let n = Math.floor(text.length / 2)
        return text.split('').reduce((a, v, i) => {
          a[i % 2 ? (i - 1) / 2 : n + (i / 2)] = v
          return a
        }, []).join('')
      }
      
      const join = (text) => {
        let n = Math.floor(text.length / 2)
        return text.split('').reduce((a, v, i) => {
          a[i < n ? (i + 1) * 2 - 1 : (i - n) * 2] = v
          return a
        }, []).join('')
      }
      
      const shuffle = (text, n) => {
        if (text == null) {
          return null
        }
      
        for (let i = 0; i < n; i++) {
          text = split(text)
        }
      
        return text
      }
      
      const deshuffle = (text, n) => {
        if (text == null) {
          return null
        }
      
        for (let i = 0; i < n; i++) {
          text = join(text)
        }
      
        return text
      }

































app.listen(8500, function () {
    
        console.log('TEST 8500!');
        //console.log("PRODUCTION ON PORT 8000")
    });


    