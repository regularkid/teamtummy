var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var striptags = require('striptags');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response)
{
    var mealId = request.query.mealid;
    if (mealId)
    {
        response.sendFile(__dirname + '/views/meal.html');
    }
    else
    {
        response.sendFile(__dirname + '/views/index.html');
    }
});

app.post('/createmeal', function(request, response)
{
    var newMeal =
    {
        name: striptags(request.body.name),
        email: striptags(request.body.email != undefined ? request.body.email : ""),
        mealtype: striptags(request.body.mealtype != undefined ? request.body.mealtype : ""),
        menu: striptags(request.body.menu != undefined ? request.body.menu : ""),
        invitelist: striptags(request.body.invitelist != undefined ? request.body.invitelist : ""),
        cutoff: request.body.cutoff
    };

    console.log("Inserting meal: " + JSON.stringify(newMeal));

    mongodb.MongoClient.connect(GetDatabaseURI(), function(err, db)
    {
        if(err) throw err;

        var mealsDB = db.collection("meals");
        mealsDB.insert(newMeal, function(err, result)
        {
            if(err) throw err;

            var mealId = result["ops"][0]["_id"];
            console.log("Inserted meal ID: " + mealId);
            
            SetCookie(mealId, striptags(request.body.name), response);
            SendInviteEMail(newMeal, mealId);

            response.redirect('/?mealid=' + mealId);
        });
    });
});

app.post('/createtummy', function(request, response)
{
    var newTummy =
    {
        name: striptags(request.body.name),
        email: striptags(request.body.email != undefined ? request.body.email : ""),
        special: striptags(request.body.special != undefined ? request.body.special : ""),
        veggie: request.body.veggie,
        mealid: request.body.mealid
    };
  
    console.log("Inserting tummy: " + JSON.stringify(newTummy));

    mongodb.MongoClient.connect(GetDatabaseURI(), function(err, db)
    {
        if(err) throw err;

        var tummiesDB = db.collection("tummies");
        tummiesDB.insert(newTummy, function(err, result)
        {
            if(err) throw err;

            var tummyId = result["ops"][0]["_id"];
            console.log("Inserted tummy ID: " + tummyId);
            SetCookie(tummyId, striptags(request.body.name), response);
            response.redirect('/?mealid=' + request.body.mealid);
        });
    });
});

app.get("/gettummies", function (request, response)
{
    mongodb.MongoClient.connect(GetDatabaseURI(), function(err, db)
    {
        var tummiesDB = db.collection("tummies");
        tummiesDB.find({ $and: [{ mealid : request.query.mealid }, { mealid : { $exists : true }}]}).toArray(function (err, docs)
        {
            var resultJSON = {};
            resultJSON.tummies = [];
            var text = "";
            docs.forEach(function (doc)
            {
                resultJSON.tummies.push(doc);
            });

            response.send(JSON.stringify(resultJSON));
        });
    });
});

app.get("/getmeal", function (request, response)
{
    mongodb.MongoClient.connect(GetDatabaseURI(), function(err, db)
    {
        var mealsDB = db.collection("meals");
        mealsDB.findOne({"_id": new ObjectId(request.query.mealid)}, function(err, meal)
        {
            response.send(JSON.stringify(meal));
        });
    });
});

// listen for requests :)
var listener = app.listen("3000", function ()
{
    console.log('Your app is listening on port ' + listener.address().port);
});

// Util functions
function GetDatabaseURI()
{
    return "mongodb://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.HOST + ":" + process.env.PORT + "/" + process.env.DB;
}

function SetCookie(name, value, response)
{
    //7 * 24 * 60 * 60 * 1000 === 604800000, or 7 days in milliseconds
    var expiryDate = new Date(Number(new Date()) + 604800000); 
    response.cookie(name, value, { expires: expiryDate, httpOnly: false });
}

function EmailObj()
{
    this.from = '"Team Tummy" <teamtummyfood@gmail.com>';
    this.to = "";
    this.cc = "";
    this.subject = "";
    this.bodyHTML = "";

    this.transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth:
        {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        }
    });

    this.SetTo = function(toList)
    {
        this.to = toList;
    };

    this.SetCC = function(ccList)
    {
        this.cc = ccList;
    };

    this.SetSubject = function(subjectText)
    {
        this.subject = subjectText;
    };

    this.SetHTMLBody = function(html)
    {
        this.bodyHTML = html;
    };

    this.Send = function()
    {
        var bodyText = this.bodyHTML;
        bodyText = striptags(bodyText);

        var mailOptions =
        {
            from: '"Team Tummy" <teamtummyfood@gmail.com>',
            to: this.to,
            cc: this.cc,
            subject: this.subject,
            text: bodyText,
            html: this.bodyHTML
        };

        this.transporter.sendMail(mailOptions, (error, info) =>
        {
            if (error)
            {
                return console.log(error);
            }

            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    };
}

function SendInviteEMail(meal, mealId)
{
    var emailObj = new EmailObj();
    emailObj.SetTo(meal.invitelist);
    emailObj.SetCC(meal.email);
    emailObj.SetSubject("You're invited to join a meal: " + meal.name + "!");
    emailObj.SetHTMLBody("To sign up for <b>" + meal.name + "</b> click the link below and enter your info:<br /><br />https://teamtummy.glitch.me/?mealid=" + mealId + "<br /><br />Love,<br />Team Tummy");
    emailObj.Send();
}