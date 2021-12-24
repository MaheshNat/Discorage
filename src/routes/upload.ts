import { Router } from 'express';
import DiscorageClient from '../client/DiscorageClient';
import Chunk from '../models/Chunk';
import { TextChannel } from 'discord.js';
import { read } from '../utils/utils';
import File from '../dbModels/File';
import fs from 'fs';

const uploadRouter = Router();

uploadRouter.use('', async (req, res) => {
  const client: DiscorageClient = res.locals.discorageClient;

  const existingFile = await File.findOne({
    name: req.file.originalname,
  });
  if (existingFile !== null)
    return res.render('pages/duplicate', { name: req.file.originalname });

  const chunks: Chunk[] = [];
  const storageChannelId = client.settings.get(
    client.config.guildId,
    'storageChannelId',
    client.guilds.cache.get(client.config.guildId).systemChannelId
  );
  const storageChannel = (await client.guilds.cache
    .get(client.config.guildId)
    .channels.fetch(storageChannelId)) as TextChannel;

  // chunking and uploading file to discord
  let index = 0;
  for await (const chunk of read(req.file.path, client.config.chunkSize)) {
    const chunkMessage = await storageChannel.send({
      files: [
        { name: `${req.file.filename}-chunk-${index}`, attachment: chunk },
      ],
    });
    chunks.push({
      url: chunkMessage.attachments.first().url,
      channelId: storageChannelId,
      messageId: chunkMessage.id,
    });
    index += 1;
  }

  // saving file to database
  await File.create({
    name: req.file.originalname,
    size: req.file.size,
    chunks: chunks,
  });

  // deleting multer storage file
  fs.unlinkSync(req.file.path);

  return res.render('pages/success');
});

export default uploadRouter;
