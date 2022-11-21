const tail = require('../utils/tail');

test('runs tail', async () => {
  const logs = await tail('./test/sample.log');
  expect(logs.length).toBe(1000);
});

test('runs tail with limit of 50', async () => {
  const logs = await tail('./test/sample.log', { limit: 50 });
  expect(logs.length).toBe(50);
});

test('runs tail for lines including substring "ASL Sender Statistics"', async () => {
  const logs = await tail('./test/sample.log', {
    limit: 50,
    search: 'ASL Sender Statistics',
  });
  expect(logs.length).toBeGreaterThan(0);
  const filteredLogs = logs.filter((l) => !l.includes('ASL Sender Statistics'));
  expect(filteredLogs.length).toEqual(0);
});

test('runs tail with limit of 50 lines including substring "ASL Sender Statistics"', async () => {
  const logs = await tail('./test/sample.log', {
    limit: 50,
    search: 'ASL Sender Statistics',
  });
  expect(logs.length).toBe(50);
});

test('runs tail and expects lines to be in descending order', async () => {
  const logs = await tail('./test/sample.log', { limit: 4 });
  const logDateTimes = logs.map((l) => new Date(l.slice(0, 15)).getTime()); // slice ts from log line and convert to epoch

  expect(logDateTimes[0]).toBeGreaterThan(logDateTimes[1]);
  expect(logDateTimes[1]).toBeGreaterThan(logDateTimes[2]);
  expect(logDateTimes[2]).toBeGreaterThan(logDateTimes[3]);
});

test('runs tail with undefined options and returns output with default options', async () => {
  const logs = await tail('./test/sample.log', {
    limit: undefined,
    search: undefined,
  });
  expect(logs.length).toBe(1000);
});

test('throws error of file not found', async () => {
  const fileNameTypo = async () =>
    await tail('./test/sample.lo', {
      limit: undefined,
      search: undefined,
    });
  await expect(fileNameTypo).rejects.toThrow('no such file or directory');
});
