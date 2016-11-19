var express = require("express");
var path = require("path");
var app = express();

var NLDate, unix_time;
var result;
var month, day, year;

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'];

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/:query', function (request, response) {
    
    // get argument
    var date = request.params.query;
    
    // check if the argument is unixtime (only digits) or natural language date
    var format = /[a-z]/i.test(date);
    if (!format) {
        //console.log('unix format');
        unix_time = date;
        // convert unix time to date
        NLDate = new Date(unix_time * 1000);
        
        // format date to natural language
        NLDate = NLDate.toLocaleDateString().split('/');
        month = months[NLDate[0] - 1];
        day = NLDate[1] + ',';
        year = NLDate[2];
        NLDate = month + ' ' + day + ' ' + year;
        result = {
            'unix': +unix_time,
            'natural': NLDate
        };
        
    } else {
        //console.log('not unix format');
        
        // split date arg
        date = date.split(' ');
    
        // set date vars
        month = date[0];
        day = date[1];
        year = date[2];
    
        // date validation
        if (isMonth(month) === true && isDay(day) === true) {
            NLDate = month + ' ' + day + ' ' + year;
            
            // convert date to unix time
            unix_time = Date.parse(NLDate) / 1000;
            result = {
            'unix': unix_time,
            'natural': NLDate
            };
            
        } else {
            //console.log('Not a valid date');
            NLDate = 'null';
            unix_time = 'null';
            result = {
            'unix': unix_time,
            'natural': NLDate
            };
        }
        
    }
    response.send(result);
});


app.listen(8080, function () {
    
});

function isMonth(month) {
    //console.log('checking if month is valid');
    if(months.indexOf(month) != -1) {
        return true;
    } else {
        return false;
    }
}

function isDay(day) {
    //console.log('checking if day is valid');
    day = day.replace(',', '');
    if (day > 0 && day < 31) {
        return true;
    } else {
        return false;
    }
}