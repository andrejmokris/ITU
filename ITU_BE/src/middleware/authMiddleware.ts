import { UnauthorizedError, ValidationError } from '../utils/errors';
import { verifyToken } from '../utils/crypto';
import { findById } from '../repositories/userRepository';

const authMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies['_auth']) {
    token = req.cookies['_auth'];
  } else {
    res.status(400);
    next(new ValidationError('Token not found'));
  }

  try {
    const id = verifyToken(token);
    const userEntity = await findById(Number(id));
    req.user = Number(id);
    next();
  } catch (error) {
    next(new UnauthorizedError());
  }
};

export default authMiddleware;
