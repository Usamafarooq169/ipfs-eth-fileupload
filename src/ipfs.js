
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// const ipfs = new IPFS({host: '127.0.0.1', port: '8080', protocol:'http'});
export default ipfs;    