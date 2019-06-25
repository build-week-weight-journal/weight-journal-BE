const server = require('./server.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const Lifts = require('./lifts-model');
const protected = require('./middleware');
const cors = require('cors');

const secret = 'bor@t';

server.use(cors());

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '1d'
  };
  const token = jwt.sign(payload, secret, options);
  return token;
}

// endpoints
// [POST] /api/register
server.post('/api/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// [POST] /api/login
server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username} we have a token!`,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// [GET] /api/users - protect this endpoint so only logged in users can see it
server.get('/api/users', protected, (req, res) => {
  Users.find('users')
    .select('id', 'username')
    .then(users => {
      res.status(200).json({ users, decodedToken: req.decodedToken });
    })
    .catch(err => {
      res.send(err);
    });
});

// [GET] /api/users - get users by id
server.get('/api/users/:id', protected, (req, res) => {
  let id = req.params.id;

  Users.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ users, decodedToken: req.decodedToken });
      } else {
        res.status(400).json({ message: 'The specified user does not exist.' });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// [PUT] /api/userid - udpate user info
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  Users.update(id, changes)
    .then(changes => {
      if (changes) {
        res.status(200).json({ message: 'User detail successfully updated.' });
      } else {
        res.status(404).json({ message: 'The specified user does not exist.' });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// [GET] /api/lifts - get all lifts
server.get('/api/lifts', protected, (req, res) => {
  Lifts.find('lifts')
    .select('id', 'user_id')
    .then(lifts => {
      res.status(200).json({ lifts, decodedToken: req.decodedToken });
    })
    .catch(err => {
      res.send(err);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n === Running on ${port} === \n`));
