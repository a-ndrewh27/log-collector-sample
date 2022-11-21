const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
