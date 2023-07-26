const fs = require('fs');
const { SHA256 } = require('crypto-js');

const GENESIS_BLOCK = {

  blockNo: "1",
  data: "",
  hash: "0x0000000000",
  nounce: "0",

};

let blockchain = [GENESIS_BLOCK];
const BLOCKS_DIR = './blocks';

function saveBlockchain() {

  if (!fs.existsSync(BLOCKS_DIR)) {
  fs.mkdirSync(BLOCKS_DIR);
  }
 fs.writeFileSync(`${BLOCKS_DIR}/blockchain.json`, JSON.stringify(blockchain), 'utf8');
}
function loadBlockchain() {
 if (!fs.existsSync(`${BLOCKS_DIR}/blockchain.json`)) {
  return;
}
 const data = fs.readFileSync(`${BLOCKS_DIR}/blockchain.json`, 'utf8');
 blockchain = JSON.parse(data);
}

function calculateBlockHash({ blockNo, data, nounce, previousHash }) {
 return SHA256(`${blockNo}${data}${nounce}${previousHash}`).toString();
}

function mineBlock(data) {

let blockNo = (blockchain.length + 1).toString();
let nounce = 0;
let blockHash;

 while (true) {
  blockHash = calculateBlockHash({
      blockNo,
      data,
      nounce,
      previousHash: blockchain[blockchain.length - 1].hash,

    });

    if (blockHash.startsWith('00')) {
      break;
    }
    nounce++;
    if (nounce > 100000) {
     throw new Error("Couldn't find nounce in 100000 iterations");
    }
  }
   const newBlock = {
    
    blockNo,
    data,
    hash: blockHash,
    prehash: blockchain[blockchain.length - 1].hash,
    nounce,
  };
 blockchain.push(newBlock);
  saveBlockchain();
 return newBlock;
}
function getBlockByNumber(blockNo) {
 return blockchain.find(block => block.blockNo === blockNo);
}

function getChainStats() {
  return {
    blockCount: blockchain.length,
    latestBlockHash: blockchain[blockchain.length - 1].hash,
  };
}
loadBlockchain();
module.exports = {
  mineBlock,
  getBlockByNumber,
  getChainStats,
};