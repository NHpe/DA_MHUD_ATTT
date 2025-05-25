import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../Models/UserModel';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET || '123456',
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) 
                return done(null, user);
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    })
);

const authenticateJWT = passport.authenticate('jwt', { session: false });

export default authenticateJWT;