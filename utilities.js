var COLLECTION_NAME = 'users';
exports.pwHash = function(password) {
    var hash, hash1 = 1, hash2 = 1;
    var code;
            
            /*for (var i = 0; i < password.length; i++) {
                code = password.charCodeAt(i);
                
                for (var j = i+1; i > 0; i--) {
                    hash *= code;
                }
            }*/

    var odd = true;
    for (var i = 0; i < password.length; i++) {
        code = password.charCodeAt(i);
        code /= (i+1);

        if (odd) {
            for (var j = 0; j <= i; j++) {
                hash1 *= code;
                hash1 %= 1000000000;
            }
            odd = false;
        } else {
            for (var j = 0; j <= i; j++) {
                hash2 *= code;
                hash2 %= 1000000000;
            }
            odd = true;
        }

      
    }
    hash = hash1 ^ hash2;
    return hash;
}
