import { unlink } from "fs";

export function deleteFile(filePath) {
  return unlink(filePath, err => {
    if(err) {
      console.log(err);
    }
  });
}
