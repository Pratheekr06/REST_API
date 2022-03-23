const jwt = require('jsonwebtoken');

const generateToken = (res, user) => {
    const token = jwt.sign(
        {id: user._id.toString()},
        "" + process.env.jwt_secret,
        { expiresIn: 10800 },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                message: 'User logged in successfullt',
                userId: user._id.toString(),
                token,
                expires: new Date().getTime() + 1000*60*60*3,
            })
            return token;
        }
    );
    console.log(token);
    return res.cookie('token', token, {
        expires: new Date(new Date().getTime() + 1000*60*60*3),
        secure: false,
        httpOnly: true,
    });
}

module.exports = generateToken;