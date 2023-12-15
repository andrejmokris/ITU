import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ConflictError, NotFoundError } from '../utils/errors';
import newEventScheme from '../schemas/newEventScheme';
import { z } from 'zod';

export const findEvents = async (req: Request, res: Response, next: NextFunction) => {
  const events = await prisma.event.findMany();
  res.json(events);
};

export const findEventById = async (req: Request, res: Response, next: NextFunction) => {
  const event = await prisma.event.findFirst({
    where: {
      id: Number(req.params.id)
    }
  });

  if (!event) {
    next(new NotFoundError('Event not found'));
  }
  res.json(event);
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  const eventData = req as z.infer<typeof newEventScheme>;
  // @ts-expect-error
  const userId = Number(req.user);

  const newEvent = await prisma.event.create({
    data: {
      authorId: userId,
      title: eventData.body.title,
      description: eventData.body.description,
      startDate: eventData.body.startDate,
      imageURL: eventData.body.imageURL
    }
  });

  res.json(newEvent);
};

export const signUpToEvent = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);
  const eventId = Number(req.params.id);

  const findEvent = await prisma.event.findFirst({
    where: {
      id: eventId
    }
  });

  if (!findEvent) {
    next(new NotFoundError('Event not found'));
    return;
  }

  const exisitingParticipation = await prisma.eventParticipation.findFirst({
    where: {
      userId: userId,
      eventId: eventId
    }
  });

  if (exisitingParticipation) {
    next(new ConflictError('You are already signed up'));
    return;
  }

  const newParticipation = await prisma.eventParticipation.create({
    data: {
      eventId: eventId,
      userId: userId
    }
  });

  res.json(newParticipation);
};

export const signOutOfEvent = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);
  const eventId = Number(req.params.id);

  const exisitingParticipation = await prisma.eventParticipation.findFirst({
    where: {
      userId: userId,
      eventId: eventId
    }
  });

  if (!exisitingParticipation) {
    next(new NotFoundError('Pa'));
    return;
  }

  const deletedParticipation = await prisma.eventParticipation.delete({
    where: {
      id: exisitingParticipation.id
    }
  });

  res.json(deletedParticipation);
};

export const myCalendar = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);

  const myParticipations = await prisma.eventParticipation.findMany({
    where: {
      userId: userId
    },
    include: {
      event: true
    }
  });

  res.json(myParticipations);
};
