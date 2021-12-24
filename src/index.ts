import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

import DiscorageClient from './client/DiscorageClient';
import { ColorResolvable } from 'discord.js';

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import pingRouter from './routes/ping';
import downloadRouter from './routes/download';
import uploadRouter from './routes/upload';
import consola from 'consola';
const port = process.env.port || process.env.PORT || 8080;

const init = async () => {
  const client: DiscorageClient = new DiscorageClient({
    token: process.env.token,
    statusUrl: process.env.statusUrl,
    embedColor: process.env.embedColor as ColorResolvable,
    defaultPrefix: process.env.defaultPrefix,
    owners: JSON.parse(process.env.owners),
    baseUrl: process.env.baseUrl,
    guildId: process.env.guildId,
  });
  client.start();

  // initializing multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'data')),
  });
  const upload = multer({ storage: storage });

  // initializing oauth server
  const sslRedirect = (environments = ['production'], status = 302) => {
    const currentEnv = process.env.NODE_ENV;
    const isCurrentEnv = environments.includes(currentEnv);
    return (req, res, next) => {
      if (isCurrentEnv) {
        req.headers['x-forwarded-proto'] !== 'https'
          ? res.redirect(status, 'https://' + req.hostname + req.originalUrl)
          : next();
      } else next();
    };
  };

  const app = express();
  app.set('views', join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/upload', (req, res, next) => res.render('pages/upload'));

  app.use(sslRedirect());
  app.use(express.json({ limit: '500mb' }));
  app.use(cors());
  app.use('/ping', pingRouter);
  app.use('/download', downloadRouter);
  app.post(
    '/upload',
    upload.single('file'),
    (req, res, next) => {
      res.locals.discorageClient = client;
      next();
    },
    uploadRouter
  );
  app.use(express.static(join(__dirname, 'public')));
  app.listen(port, () => {
    consola.ready(`Express server listening on port ${port}.`);
  });
};

init();
