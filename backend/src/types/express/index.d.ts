// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user: {
        _id: string;
        /** Explain label here */
        role: 1 | 2 | 3 | 4 | 5;
      };
    }
  }
}
