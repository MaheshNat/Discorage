import { Router } from 'express';
import File from '../dbModels/File';
const downloadRouter = Router();
import { saveFile } from '../utils/utils';
import path from 'path';
import consola from 'consola';
import fs from 'fs';

downloadRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const file = await File.findById(id);
  const filePath = path.join(__dirname, '..', 'data', file.name);

  for (const chunk of file.chunks) {
    await saveFile(chunk.url, filePath);
  }

  res.download(filePath, (err) => {
    if (err) consola.error(err);
    else fs.unlinkSync(filePath);
  });
});

export default downloadRouter;
