var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {


    var prompt = require('prompt');
    prompt.start();
     
    prompt.get(['number'], function (err, result) {
    
      //console.log('Command-line input received:');
      console.log('  Enter the amount of numbers to be push into Stack: ' + result.number);
      console.log('  Pop Element From Stack : ');
    
      var arr = [];
    
    // append new value to the array
    arr.push(result.number);
    
    

    var i=0;
    while (i < 5) {
        
        // console.log('  Enter the value of '+ i + ' number' );
        var prompt = require('prompt');
        prompt.start();
        prompt.get(['number1'], function (err, result) {
    
            //console.log('Command-line input received:');
           
            //console.log('  Pop Element From Stack : ');
          
            arr.push (result.number1);
                       

        } )  

        i=i+1;
};

    console.log(arr);






});



    
      
    


  //console.log('Example app listening on port 3000!');


});








