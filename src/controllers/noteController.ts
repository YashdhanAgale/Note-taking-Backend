import { Request, Response } from 'express';
import Note from '../models/Note';

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  console.log("User ID from token:", (req as any).userId);

  const note = await Note.create({ user: (req as any).userId, title, content });
  res.json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Note.findOneAndDelete({ _id: id, user: (req as any).userId });
  res.json({ message: 'Note deleted' });
};

export const getNotes = async (req: Request, res: Response) => {
  const notes = await Note.find({ user: (req as any).userId });
  res.json(notes);
};