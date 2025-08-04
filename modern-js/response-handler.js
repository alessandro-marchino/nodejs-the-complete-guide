import fs from 'node:fs';

export const resHandler = (req, res) => {
  fs.readFile('my-page.html', 'utf8', (err, data) => res.send(data));
};
