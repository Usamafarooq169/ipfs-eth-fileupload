import { Table, Container, Button, Form, Grid } from 'react-bootstrap';
import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import firebase from "./config/firebase";

class App extends Component {

  state = {
    ipfsHash: null,
    buffer: '',
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    gasUsed: '',
    txReceipt: '',
    retrievedHash: [],
    fileName: '',
    filesRecordArr : [],
    addedFiles: []
  };

  componentDidMount(){
    var ref = firebase.database().ref("filesInfo").once('value').then((snapshot)=>{
      const files = []; 
      snapshot.forEach(function(childSnapshot) {
        
        files.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });



      });

      this.setState({
        addedFiles: files
      } , ()=>console.log(this.state))
    })
   
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    
    let fname = file.name
    fname = fname.replace(/\.[^/.]+$/, "")
    // this.setState({ fileName: fname })
    console.log(`File Name: ${fname}`)
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
    this.setState({ fileName: fname })
  };

  convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  onClick = async () => {

    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
        console.log(err, txReceipt);
        this.setState({ txReceipt });
      }); //await for getTransactionReceipt

      await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      await this.setState({ gasUsed: this.state.txReceipt.gasUsed });

      const accountss = await web3.eth.getAccounts();
      storehash.methods.getFileRecord().call({
        from: accountss[0]
        }, (error, retrievedFiles) => {
          // let str;
          // for (let i = 0; i < retrievedHash.length; i++) {
            console.log(`These are Files Stored:  ${retrievedFiles}`);
            //this.setState({retrievedHash[i]});
          // }
        }); //getEnd

        
        let filesRecord = new Map();
        const {fileName , ipfsHash} = this.state;
        filesRecord.set(this.state.fileName, this.state.ipfsHash);
        this.setState({ filesRecordArr: [...this.state.filesRecordArr, ...filesRecord ] });
        for (let [key, value] of filesRecord) {
          console.log(`This is File Record Mapping... Key: ${key} and the value: ${value}`);
        }
        console.log(`This is Record Array: ${this.state.filesRecordArr}`);
        console.log("database ",firebase.database);

        var newFileInfoKey = firebase.database().ref().child('filesInfo').push().key;
        var updates = {};
        updates['/filesInfo/' + newFileInfoKey] = { fileName , ipfsHash};
        firebase.database().ref().update(updates);

        // const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
        // fetch(apiUrl)
        //   .then((response) => response.json())
        //   .then((data) => console.log('This is your data', data));
        
        // console.log(`This is File Record Mapping: ${filesRecord}`);


      

           
      
    } //try
    catch (error) {
      console.log(error);
    } //catch
  } //onClick


  onSubmit = async (event) => {
    event.preventDefault();
    window.ethereum.enable()
    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();

    console.log('Sending from Metamask account: ' + accounts[0]);

    //obtain contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ ethAddress });

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log("Trying");
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ ipfsHash: ipfsHash[0].hash });
      //this.setState({ ipfsHash: ipfsHash[0]. });
      console.log(`THis is IPFS hash: ${ipfsHash[0].hash}`);
      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

      storehash.methods.addFileRecord(this.state.fileName, this.state.ipfsHash).send({
        from: accounts[0]
      }, (error, transactionHash) => {
        console.log(`This is transaction hash:  ${transactionHash}`);
        this.setState({ transactionHash });
      }); //storehash

      
    }) //await ipfs.add 
      

  }; //onSubmit 


  
  // onPress = async () => {
    
  // }; //onPress 



  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1> BBSPI IPFS File Upload System </h1>
        </header>

        <hr />

        <Grid>
          <h3> Choose file to upload to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input
              type="file"
              onChange={this.captureFile}
            />
            <Button
              bsstyle="primary"
              type="submit">
              Send it
             </Button>
          </Form>

          <hr />
          <Button onClick={this.onClick}> Get Transaction Receipt </Button>

          <hr />
          {/* <Button onClick = {this.onClick}> Show Uploaded Files </Button>
          <hr /> */}

          <Table bordered responsive>
            <thead>
              <tr>
                <th>Tx Receipt Category</th>
                <th>Values</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>File Name</td>
                <td>{this.state.fileName}</td>
              </tr>
              <tr>
                <td>IPFS Hash # stored on Eth Contract</td>
                <td>{this.state.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td>{this.state.ethAddress}</td>
              </tr>

              <tr>
                <td>Tx Hash # </td>
                <td>{this.state.transactionHash}</td>
              </tr>

              <tr>
                <td>Block Number # </td>
                <td>{this.state.blockNumber}</td>
              </tr>

              <tr>
                <td>Gas Used</td>
                <td>{this.state.gasUsed}</td>
              </tr>
            </tbody>
          </Table>
        </Grid>
      </div>
    );
  } //render
}

export default App;