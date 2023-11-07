import { NextFunction, Request, Response } from 'express';
import * as followRepository from '../repositories/followRepository';

export const isUserFollowingShop = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const user_id = req.user;

  const data = await followRepository.userFollowsShop(Number(req.params.id), user_id);
  if (!data) {
    res.json({ follow: false });
  } else {
    res.json({ follow: true });
  }
};

export const newShopFollow = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const user_id = req.user;

  const checkDuplicate = await followRepository.userFollowsShop(Number(req.params.id), user_id);

  if (checkDuplicate) {
    res.json(checkDuplicate);
    return;
  }

  const data = await followRepository.create(Number(req.params.id), user_id);
  res.json(data);
};

export const removeFollow = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const user_id = req.user;

  const data = await followRepository.userFollowsShop(Number(req.params.id), user_id);

  if (data) {
    await followRepository.remove(data.id);
  }

  res.json({ status: true });
};
