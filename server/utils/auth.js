const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) { // changed req, res, next to { req }
    // allows token to be sent via  req.body (per change?), req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;  // added req.body.token

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;  // removed: res.status(400).json({ message: 'You have no token!' })
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      // removed: return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    // removed: next();
    // added: return updated request object
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
