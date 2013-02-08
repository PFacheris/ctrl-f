var email = require("mailer");
module.exports = function () {
    return {
        singleEmail: function (request, response) {
            var message = {
                host: 'smtp.sendgrid.net',
                port: "587",
                domain: 'ctrl-f.herokuapp.com',
                to: request.param('to'),
                from: 'club1505inc@gmail.com', 
                subject: request.param('subject'),
                text: request.param('text'),
                authentication: 'login',
                username: 'club1505',
                password: 'schaprio'
            };

            email.send(message, function(err, result) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
}
