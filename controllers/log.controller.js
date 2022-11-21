const tail = require('../utils/tail');

exports.readLines = async (req, res) => {
  const { filename, limit, search } = req.query;

  if (!filename) {
    res.status(400).send('query parameter "filename" is required');
    return;
  }

  try {
    const logs = await tail(`/var/log/${filename}`, { limit, search });
    res.json({ logs });
  } catch (err) {
    if (err.message.includes('no such file or directory')) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
};
