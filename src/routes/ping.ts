import { Router } from 'express';
const pingRouter = Router();

pingRouter.get('', (req, res) => {
  res.status(200).json({ message: 'PONG!' });
});

export default pingRouter;
