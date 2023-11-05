import { NextFunction, Request, Response } from 'express';
import * as shopRepository from '../repositories/shopRepository';

export const getAllShops = async (req: Request, res: Response) => {
  const data = await shopRepository.findAll();
  res.json(data);
};

export const filterShops = async (req: Request, res: Response) => {
  const { location, rating, assortment, sortBy, tag } = req.query;
  // @ts-expect-error
  const filterByTags = await shopRepository.findByTags(Array.isArray(tag) ? tag : [tag]);
  // @ts-expect-error
  const filteredByLocation = await shopRepository.findByLocation(location);

  const locationIDs = filteredByLocation.map((shop) => shop.id);

  // Find the intersection of shops based on unique IDs
  const intersection = filterByTags.filter((shop) => locationIDs.includes(shop.id));

  res.json(intersection);
};

export const getShopById = async (req: Request, res: Response) => {
  const data = await shopRepository.findById(Number(req.params.id));
  res.json(data);
};
