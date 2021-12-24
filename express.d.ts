import DiscorageClient from './src/client/DiscorageClient';

declare namespace Express {
  interface Request {
    client?: DiscorageClient;
  }
}

export {};
