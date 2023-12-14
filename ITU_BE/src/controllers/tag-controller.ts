import { NextFunction, Request, Response } from 'express';
import * as tagRepository from '../repositories/tagRepository';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';

export const getTagById = async (req: Request, res: Response, next: NextFunction) => {
  const Id = Number(req.params.id);
  const data = await tagRepository.findById(Id);
  if (!data) {
    next(new NotFoundError('Tag not found'));
    return;
  }
  res.json(data);
};

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  const data = await tagRepository.findAll();
  res.json(data);
};
