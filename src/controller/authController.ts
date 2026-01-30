import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  console.log(req.body);

  res.send({}).status(201);
};

export default { register };
