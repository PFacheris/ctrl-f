var SendGrid = require('sendgrid').SendGrid,
    mailer = new SendGrid('club1505', 'schapiro'); 

// send Single Email with specified to, subject, text body
exports.singleEmail= function (request, response) {
    var message = {
        to: request.param('to'),
        from: 'club1505inc@gmail.com', 
        fromname: 'ctrl-f',
        subject: request.param('subject'),
        text: request.param('text'),
    };

    mailer.send(message, function(success, message) {
        if (!success) {
            console.log(message);
        }
    });
};

// sign up confirmation email
exports.confirmationEmail= function (email) {
    var message = {
        to: email,
        from: 'club1505inc@gmail.com',
        fromname: 'ctrl-f',
        subject: 'Welcome to ctrl-f!',
        html: "Welcome to ctrl-f!  We're just three hooligans tyring to help you find your stuff! <br> Come visit us at <a href='http://ctrl-f.herokuapp.com'>ctrl-f.herokuapp.com</a><br><br>We hope you enjoy! <br> Chae, Patrick, & Ted"
    };

    mailer.send(message, function (success, message) {
        if (!success) {
            console.log(message);
        }
    });
};

// password reset email
exports.passReset = function (email, tempPass) {
    var message = {
	to: email,
	from: 'club1505inc@gmail.com',
	fromname: 'ctrl-f Password Rest',
	subject: 'Your Password has been Reset!',
	html: "Your password has been reset by one of the three hooligans.  Use the below password to login and manually reset your password. <br><br>&nbsp;&nbsp;&nbsp;&nbsp;Password: " + tempPass + "<br><br>Find your stuff at <a href='http://ctrl-f.herokuapp.com'>ctrl-f.herokuapp.com</a>"
    };

    mailer.send(message, function (success, message) {
	if (!success) {
	    console.log(message);
	}
    });
};

// delivery confirmation email
exports.delivery = function (email, parcelName, tracking) {
    var parcelName2;
    if (parcelName != ' ') {
        parcelName2 = ' (' + parcelName + ') ';
    } else {
        parcelName2 = parcelName
    }

    var message = {
        to: email,
        from: 'club1505inc@gmail.com',
        fromname: 'ctrl-f Delivery Notifications',
        subject: 'Your Package' + parcelname + 'has been Delievered!',
        html: "We have received notification from your shipping company that your package" + parcelName2 + "has been delivered! <br><br>&nbsp;&nbsp;&nbsp;&nbsp;Package Name: " + parcelName + "<br>&nbsp;&nbsp;&nbsp;&nbsp;Trackgin Number: " + tracking + "<br><br>Enjoy your parcel!<br><a href='http://ctrl-f.herokuapp.com'><ctrl-f.herokapp.com</a>"
    };

    mailer.send(message, function(success, message) {
        if (!success) {
            console.log(message);
        }
    });
};
