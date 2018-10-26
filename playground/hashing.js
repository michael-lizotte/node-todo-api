const {SHA512} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$bmN7QY1bn5EkzTZCYyxEruuJlJegxpQnIwmgb8remHAZZ6kDiST.W'

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc')
// console.log(decoded);

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA512(JSON.stringify(data) + 'some secret').toString()
// }

// token.data.id = 5;
// token.hash = SHA512(JSON.stringify(token.data)).toString();

// var resultHash = SHA512(JSON.stringify(token.data) + 'some secret').toString();

// if (resultHash === token.hash) {
//     console.log("data wasn't changed");
// } else {
//     console.log("data was changed");
// }
