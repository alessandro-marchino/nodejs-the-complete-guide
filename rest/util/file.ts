import { unlink } from "fs";
import { join } from "path";

export const clearImage = (filePath: string) => {
  unlink(join(__dirname, '..', filePath), err => console.log(err));
};
