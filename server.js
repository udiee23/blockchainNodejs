const express = require('express');

const bodyParser = require('body-parser');

const { mineBlock, getBlockByNumber, getChainStats } = require('./blockchain');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.post('/block', (req, res) => {

  const { data } = req.body;
  try {

    const newBlock = mineBlock(data);
    res.json(newBlock);

  } catch (err) {
  res.status(500).json({ error: err.message });

  }

});

app.get('/block', (req, res) => {

  const { blockNo } = req.query;
  if (!blockNo) {
   return res.status(400).json({ error: "blockNo parameter is required" });

  }
 const block = getBlockByNumber(blockNo);

  if (!block) {
    return res.status(404).json({ error: "Block not found" });
  }
res.json(block);

});
app.get('/block/stats', (req, res) => {
  const stats = getChainStats();
  res.json(stats);
});
app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);

});