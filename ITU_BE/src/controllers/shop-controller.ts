import { NextFunction, Request, Response } from 'express';
import * as shopRepository from '../repositories/shopRepository';
import * as reviewRepository from '../repositories/reviewRepository';
import prisma from '../db';
import { NotFoundError } from '../utils/errors';

export const getAllShops = async (req: Request, res: Response) => {
  const { q, tags } = req.query;
  const tagsArray = String(tags)
    .split(',')
    .map((tag) => parseInt(tag, 10));

  const shops = await shopRepository.findAll(String(q));

  if (tagsArray.length < 1 || Number.isNaN(tagsArray[0])) {
    res.json(shops);
    return;
  }

  const filteredShops = new Set();

  shops.forEach((shop) => {
    if (shop.ShopTag.some((element) => tagsArray.includes(element.tagId))) {
      filteredShops.add(shop);
    }
  });

  res.json(Array.from(filteredShops));
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
  const reviews = await reviewRepository.shopReviews(Number(req.params.id));

  let averageRating = 0;

  reviews.forEach((review) => {
    averageRating += review.starsGiven;
  });

  if (reviews.length > 0) {
    averageRating = averageRating / reviews.length;
  }

  res.json({ ...data, rating: averageRating, nOfReviews: reviews.length });
};

export const uploadPhoto = async (req: Request, res: Response) => {
  // @ts-ignore
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath: string = req.file.path;
  const shopId = req.params.id;

  const uploadedPhoto = await prisma.photoUpload.create({
    data: {
      uploadPath: filePath,
      shopId: Number(shopId)
    }
  });

  res.json(uploadedPhoto);
};

export const getPhoto = async (req: Request, res: Response, next: NextFunction) => {
  const photoId = Number(req.params.id);
  const photo = await prisma.photoUpload.findFirst({
    where: {
      id: photoId
    }
  });
  if (!photo || !photo.uploadPath) {
    next(next(new NotFoundError('Shop not found')));
    return;
  }

  res.sendFile(photo.uploadPath);
};
