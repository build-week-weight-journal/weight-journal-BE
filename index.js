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
        .then(registered => {
            const token = generateToken(registered);
            res.status(201).json({
                registered,
                token
            });
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
                    user_id: user.id,
                    message: `Welcome ${user.username}, let's get lifting!`,
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
                res.status(200).json(user);
                //res.status(200).json({ user, decodedToken: req.decodedToken });
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

// [DELETE] /api/userid - delete user info
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ errorMessage: 'User not deleted' });
            }
        })
        .catch((err) => res.status(500).json({
            errorMessage: "Error"
        }));
});

/* lifts */
// [GET] /api/lifts - get all lifts
server.get('/api/lifts', protected, (req, res) => {
    Lifts.find('lifts')
        .select('id', 'user_id')
        .then(lifts => {
            res.status(200).json(lifts);
        })
        .catch(err => {
            res.send(err);
        });
});

// [GET] /api/lifts/id - get lift by one specific lift id 
server.get('/api/lifts/:id', (req, res) => {
    const id = req.params.id;

    Lifts.findById(id)
        .then(lift => {
            if (lift) {
                res.status(200).json(lift);
            } else {
                res
                    .status(404)
                    .json({ message: 'The specified lift does not exist.' });
            }
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

// [GET] /api/lifts - get all lifts by userid 
server.get('/api/users/:id/lifts', async (req, res) => {
    try {
        const lifts = await Lifts.getUserLifts(req.params.id);
        res.status(200).json(lifts);
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

// [GET] /api/lifts - get all lifts by lift name  
server.get('/api/users/:id/lifts/:name', async (req, res) => {
    const userId = req.params.id;
    const name = req.params.name;

    Lifts.getLiftsByName(userId, name)
        .then(lift => {
            if (lift) {
                res.status(200).json(lift);
            } else {
                res
                    .status(404)
                    .json({ message: 'The specified lift does not exist.' });
            }
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

// [POST] /api/lifts - add a new lift 
server.post('/api/lifts', (req, res) => {
    const newLift = req.body;

    if (!newLift.name) {
        res
            .status(400)
            .json({ message: 'Please provide a name for this lift.' });
    } else {
        Lifts.add(newLift)
            .then(lift => {
                res.status(201).json(lift);
            })
            .catch(err => {
                res.status(500).json(err.message);
            });
    }
});

// [PUT] /api/lifts/id - Update lift 
server.put('/api/lifts/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    Lifts.update(id, changes)
        .then(changes => {
            if (changes) {
                res.status(200).json({ message: 'Lift excercise successfully updated.' });
            } else {
                res
                    .status(404)
                    .json({ message: 'The specified lift does not exist.' });
            }
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

// [DELETE] /api/lifts/:id - Delete lift 
server.delete('/api/lifts/:id', (req, res) => {
    const id = req.params.id;

    Lifts.remove(id)
        .then(count => {
            res.status(200).json({ message: 'Lift exercise successfully deleted.' });
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n === Running on ${port} === \n`));
