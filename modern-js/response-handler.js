import { join } from 'node:path';

export const resHandler = (req, res) => {
  res.sendFile(join(import.meta.dirname, 'my-page.html'));
};
