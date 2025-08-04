import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const resHandler = async (req, res) => {
  const content = await readFile(join(import.meta.dirname, 'my-page.html'), 'utf8');
  res.send(content);
};
