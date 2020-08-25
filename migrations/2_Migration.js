const ipfs = artifacts.require("Contract");

module.exports = function (deployer) {
  deployer.deploy(ipfs);
};
