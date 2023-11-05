import { NextFunction, Request, Response } from 'express';
import * as shopRepository from '../repositories/shopRepository';

export const getShops = async (req: Request, res: Response) => {
  const data = await shopRepository.findAll();
  res.json(data);
};

export const getShopById = async (req: Request, res: Response) => {
  const data = await shopRepository.findById(Number(req.params.id));
  res.json(data);
};
