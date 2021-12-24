import fs from 'fs';
import axios from 'axios';

export const saveFile = async (url: string, filePath: string) => {
  const writer = fs.createWriteStream(filePath, { flags: 'a' });

  const response = await axios.get(url, {
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const readBytes = (fd: number, size: number): Promise<Buffer> => {
  const buffer = Buffer.alloc(size);
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, 0, buffer.length, null, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
};

export async function* read(
  filePath: string,
  size: number
): AsyncGenerator<Buffer> {
  const stats = fs.statSync(filePath);
  const fd = fs.openSync(filePath, 'r');

  for (let i = 0; i < Math.ceil(stats.size / size); i++) {
    const buffer = await readBytes(fd, size);
    yield buffer;
  }
}
