pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
contract Contract 
{
    mapping (string => string) filesRecord;

    string[] ipfsFileNames;
     
     
     
     
    function addFileRecord (string memory fileName, string memory fileAddress) public 
    {
  
        filesRecord[fileName] = fileAddress;
  
        // push fileNames to an array
        ipfsFileNames.push(fileName);
    }
    
    function getFileRecord () public view returns (string [] memory)
    {
        return ipfsFileNames;
    }
    
    //Code2
    
    // string[] ipfsHashes;
    
    // function sendHash(string x) public 
    // {
    //     ipfsHashes.push(x);
    // }

    // function getHash() public view returns (string[] x) 
    // {
    //     return ipfsHashes;
    // }
}