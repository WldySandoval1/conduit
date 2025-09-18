import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { SECRET } from 'src/config';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user) {
      return data ? req.user[data] : req.user;
    }

    const authHeader = req.headers?.authorization;
    if (!authHeader) return null;

    const [, token] = authHeader.split(' ');
    if (!token) return null;

    const decoded: any = jwt.verify(token, SECRET);
    return data ? decoded[data] : decoded;
  },
);
