import type { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction)=>{
  console.log("time:", Date.now());
  next()
}

export default logger