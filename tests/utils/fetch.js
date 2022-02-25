import { request } from 'http';

async function fetch(path = '/') {
  const params = {
    method: 'GET',
    host: 'localhost',
    port: 8000,
    path
  };

  return new Promise((resolve, reject) => {
    const req = request(params, (res) => {
      const { statusCode, headers } = res;
      const lastModified = new Date(headers['last-modified']).getTime();

      if (statusCode < 200 || statusCode >= 300) {
        return reject(new Error(`Status code: ${statusCode}`));
      }

      const data = [];

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => {
        resolve({
          data: Buffer.concat(data).toString(),
          lastModified
        });
      });
    });

    req.on('error', reject);

    req.end();
  });
}

export { fetch };
