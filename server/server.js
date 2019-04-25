const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const multer = require('multer');

const {mongoose}  = require('./db/mongoose');
const Author = require('./model/author');
const Book = require('./model/book');
const BookInstance = require('./model/bookInstance');
const {User} = require('./model/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());
//multer
var upload = multer({
    dest:'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('Please upload an image'));
        }             
        cb(undefined, true);
    } 
});
//Post /author
app.post('/author', (req, res) => {
    var body = _.pick(req.body, ['name', 'dateOfBirth','dateOfDeath']);
    var author  = new Author(body);

    author.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});
//post /user
app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
      //res.send(user);
      console.log('User saved');
      return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

//upload profile pic
app.post('/user/me/avatar',authenticate, upload.single('profile'), (req, res) => {
    res.send();
},(error, req, res, next) => {
    res.status(400).send({error: error.message});
});
/*app.post('/profile', upload.single('profile'), (req, res) => {
    res.send();
},(error, req, res, next) => {
    res.status(400).send({error: error.message});
});*/
// private route
app.get('/user/me', authenticate, (req, res) => {
    res.send(req.user);
  });
  
// post/user/login
app.post('/user/login',(req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    }) 
});  

//delete user token or log-out
app.delete('/user/me/token' , authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(8888, () => {
    console.log('Server started on port 8888');
});

