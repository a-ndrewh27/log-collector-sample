const fs = require('fs');
const { promisify } = require('util');

const CHUNK_SIZE = 1024 * 64;
const ENCODING = 'utf8';
const SEPERATOR = /\r?\n/;

const open = promisify(fs.open);
const read = promisify(fs.read);
const fstat = promisify(fs.fstat);

const tail = async (filename, { limit = 1000, search = '' } = {}) => {
  let fd,
    size,
    offset,
    buff,
    leftover,
    hasEnd,
    lines = [];

  const [bufCR, bufLF] = Buffer.from('\r\n', ENCODING);

  const output = await open(filename, 'r')
    .then((_fd) => {
      fd = _fd;
      return fd;
    })
    .then(fstat)
    .then(async (stats) => {
      size = stats.size;
      buffSize = Math.min(size, CHUNK_SIZE);
      offset = size - CHUNK_SIZE;
      buff = Buffer.alloc(buffSize);
      leftover = Buffer.alloc(0);
      lines = [];

      while (offset >= 0 && lines.length < limit + 1) {
        const { bytesRead, buffer } = await read(fd, buff, 0, buffSize, offset);

        const buf = Buffer.concat([buffer.slice(0, bytesRead), leftover]);
        if (offset === 0) {
          hasEnd = true;
          const str = buf.toString(ENCODING);
          let str_array = str.split(SEPERATOR).reverse();
          if (!!search) {
            str_array = str_array.filter((l) => l.includes(search));
          }
          lines = [...lines, ...str_array];
          offset = -1;
          break;
        }
        if (offset < buffSize) {
          buffSize = offset;
          offset = 0;
        } else {
          offset -= buffSize;
        }
        let sl, sr;

        const l = buff.indexOf(bufLF, 1);

        if (l >= 0) {
          const r = l + 1;
          if (buf[l - 1] === bufCR) {
            sl = l - 1;
            sr = r;
          } else {
            (sl = l), (sr = r);
          }
        }

        if (!sl) {
          leftover = buf;
          return;
        }

        leftover = buf.slice(0, sl);
        const str = buf.slice(sr).toString(ENCODING);
        let str_array = str.split(SEPERATOR).reverse();
        if (!!search) {
          str_array = str_array.filter((l) => l.includes(search));
        }
        lines = [...lines, ...str_array];
      }

      if (lines[0] === '') {
        lines.shift();
      }

      lines = lines.slice(0, limit);
      return lines;
    })
    .catch((err) => {
      throw new Error(err.message);
    });

  return output;
};

module.exports = tail;
