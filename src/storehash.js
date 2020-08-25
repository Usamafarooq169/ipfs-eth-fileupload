import web3 from './web3';
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
const address = '0x39b396c47C9670c26F2a67505F2Fb97c5f613908';
//use the ABI from your contract
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "fileName",
				"type": "string"
			},
			{
				"name": "fileAddress",
				"type": "string"
			}
		],
		"name": "addFileRecord",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getFileRecord",
		"outputs": [
			{
				"name": "",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
export default new web3.eth.Contract(abi, address);