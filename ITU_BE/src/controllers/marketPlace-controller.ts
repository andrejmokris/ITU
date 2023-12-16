import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';

export const getAllItems = async (req: Request, res: Response) => {
  const { q } = req.query;

  const query = String(q);

  const items = await prisma.marketItem.findMany({
    where: {
      OR: [
        { description: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      seller: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });

  res.json(items);
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userID = req.user;
  const itemId = Number(req.params.id);

  const marketItem = await prisma.marketItem.findFirst({
    where: {
      id: itemId
    }
  });

  if (!marketItem) {
    next(new NotFoundError('Item not found'));
    return;
  }

  if (marketItem.sellerId !== userID) {
    next(new UnauthorizedError('Not authorized'));
    return;
  }

  const deletedItem = await prisma.marketItem.delete({
    where: {
      id: itemId
    }
  });

  res.json(deletedItem);
};

export const buyItem = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userID = req.user;
  const itemId = Number(req.params.id);

  const marketItem = await prisma.marketItem.findFirst({
    where: {
      id: itemId
    }
  });

  if (!marketItem) {
    next(new NotFoundError('Item not found'));
    return;
  }

  if (!marketItem?.active) {
    next(new ConflictError('Item is no longer for sale, try a different one'));
    return;
  }

  const updatedItem = await prisma.marketItem.update({
    where: {
      id: itemId
    },
    data: {
      active: false
    }
  });

  const orderConfirm = await prisma.itemPurchase.create({
    data: {
      buyerId: userID,
      marketItemId: itemId
    }
  });

  res.json(orderConfirm);
};

export const getMarketPhoto = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = Number(req.params.id);
  const photo = await prisma.marketItem.findFirst({
    where: {
      id: itemId
    }
  });

  if (!photo || !photo.image) {
    next(next(new NotFoundError('Shop not found')));
    return;
  }

  res.sendFile(photo.image);
};
