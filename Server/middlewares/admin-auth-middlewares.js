import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const checkAdmin = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1];
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await UserModel.findById(userID).select('-password');

            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Unauthorized User' });
        }
    } else {
        return res.status(401).json({ message: 'No Token Provided' });
    }
};

export default checkAdmin;
