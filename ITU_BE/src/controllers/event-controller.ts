import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';
import newEventScheme from '../schemas/newEventScheme';
import { z } from 'zod';
import newCommentScheme from '../schemas/newCommentScheme';

export const findEvents = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);

  const events = await prisma.event.findMany({
    include: {
      EventParticipation: {
        where: {
          userId: userId
        }
      }
    }
  });
  res.json(events);
};

export const findEventById = async (req: Request, res: Response, next: NextFunction) => {
  const event = await prisma.event.findFirst({
    where: {
      id: Number(req.params.id)
    },
    include: {
      EventParticipation: true,
      author: {
        select: {
          name: true
        }
      }
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

export const editEvent = async (req: Request, res: Response, next: NextFunction) => {
  const eventData = req as z.infer<typeof newEventScheme>;
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

  if (findEvent.authorId !== userId) {
    next(new UnauthorizedError('You cant do that'));
    return;
  }

  const newEvent = await prisma.event.update({
    where: {
      id: eventId
    },
    data: eventData.body
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
    next(new NotFoundError('Participation not found'));
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

export const doIAttent = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);
  const eventId = Number(req.params.id);

  const myAttendance = await prisma.eventParticipation.findFirst({
    where: {
      eventId: eventId,
      userId: userId
    }
  });

  if (myAttendance) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
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

  if (findEvent.authorId !== userId) {
    next(new UnauthorizedError('Not authorized'));
    return;
  }

  const deletedEvent = await prisma.event.delete({
    where: {
      id: findEvent.id
    }
  });

  res.json(deletedEvent);
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentData = req as z.infer<typeof newCommentScheme>;
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

  const newComment = await prisma.eventComment.create({
    data: {
      userId: userId,
      eventId: eventId,
      text: commentData.body.text
    }
  });

  res.json(newComment);
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);
  const commentId = Number(req.params.id);

  const findComment = await prisma.eventComment.findFirst({
    where: {
      id: commentId
    }
  });

  if (!findComment) {
    next(new NotFoundError('Event not found'));
    return;
  }

  if (findComment.userId !== userId) {
    next(new UnauthorizedError('Not authorized'));
    return;
  }

  const deletedComment = await prisma.eventComment.delete({
    where: {
      id: commentId
    }
  });

  res.json(deletedComment);
};

export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = Number(req.user);
  const commentId = Number(req.params.id);

  const findComment = await prisma.eventComment.findFirst({
    where: {
      id: commentId
    }
  });

  if (!findComment) {
    next(new NotFoundError('Event not found'));
    return;
  }

  const findLike = await prisma.eventCommentLike.findFirst({
    where: {
      userId: userId,
      commentId: commentId
    }
  });

  if (!findLike) {
    const newLike = await prisma.eventCommentLike.create({
      data: {
        commentId: commentId,
        userId: userId
      }
    });
    res.json(newLike);
  } else {
    const deletedComment = await prisma.eventCommentLike.delete({
      where: {
        id: findLike.id
      }
    });
    res.json(deletedComment);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  const eventId = Number(req.params.id);

  const comments = await prisma.eventComment.findMany({
    where: {
      eventId: eventId
    },
    include: {
      EventCommentLike: true,
      user: {
        select: {
          name: true
        }
      }
    }
  });

  res.json(comments);
};
