import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';

export const getAllItems = async (req: Request, res: Response) => {
  // @ts-expect-error
  const userID = req.user;
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
      },
      ItemBookmark: {
        where: {
          buyerId: userID
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

export const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userID = req.user;
  const itemId = Number(req.params.id);

  const findDuplicate = await prisma.itemBookmark.findFirst({
    where: {
      marketItemId: itemId,
      buyerId: userID
    }
  });

  if (findDuplicate) {
    res.json(findDuplicate);
    return;
  }

  const marketItem = await prisma.marketItem.findFirst({
    where: {
      id: itemId
    }
  });

  if (!marketItem) {
    next(new NotFoundError('Item not found'));
    return;
  }

  const newBookMark = await prisma.itemBookmark.create({
    data: {
      buyerId: userID,
      marketItemId: itemId
    }
  });

  res.json(newBookMark);
};

export const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userID = req.user;
  const bookmarkId = Number(req.params.id);

  const findItem = await prisma.itemBookmark.findFirst({
    where: {
      id: bookmarkId
    }
  });

  if (!findItem) {
    next(new NotFoundError('Item not found'));
    return;
  }

  if (findItem.buyerId !== userID) {
    next(new UnauthorizedError('Not authorized'));
    return;
  }

  const removedBookmark = await prisma.itemBookmark.delete({
    where: {
      id: bookmarkId
    }
  });

  res.json(removedBookmark);
};
