// Override Express 5's req.body type from ReadableStream to any
// express.json() middleware parses it, but TS doesn't know that

import {JwtPayload} from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      body: any;
      user: JwtPayload;
      traceId: string;
    }
  }
}

export {};
