import { Request, Response } from "express";

export const helloWorld = () => {
  return async (_req: Request, res: Response) => {
    try {
      return res.status(200).send("Hello From Backend API");
    } catch (e) {
      console.error(e);
      return res.status(500).send();
    }
  };
};
