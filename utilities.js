var COLLECTION_NAME = 'users';
exports.pwHash: function(password) {
    var hash = 0;
    var code;
            
            /*for (var i = 0; i < password.length; i++) {
                code = password.charCodeAt(i);
                
                for (var j = i+1; i > 0; i--) {
                    hash *= code;
                }
            }*/

    for (var i = 0; i < password.length; i++) {
        code = password.charCodeAt(i);
        hash += code;
    }
    return hash;
}
