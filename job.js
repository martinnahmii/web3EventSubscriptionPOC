const Web3 = require("web3");
const fs = require("fs");

let poc = fs.readFile('./factory_abi.json', 'utf-8', (err, data) => { //read abi definition
    if (err){
        console.log(err)
    }else{
        let abi = JSON.parse(data);
        let web3 = new Web3(new Web3.providers.HttpProvider("yourProvider"));
          let contract = new web3.eth.Contract(abi, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'); // second parameter is the contract adress of the corresponding abi

        getPastEvents('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',10000000, 10957781, contract).then( (val) => {
            console.log("VAL")    
            console.log(val)
                   
        }, (err) => {console.log("ERRROR");console.log(err)})

          
    }
        
})

async function getPastEvents(address, fromBlock, toBlock, contract) { // async func that catches exceeding responses by calling it recursively with half of the blockamount
    if (fromBlock <= toBlock) {
        try {
            const options = {
                //filter: {token1: '0xc778417E063141139Fce010982780140Aa0cD5Ab'} apply your filter here
                fromBlock: fromBlock,
                toBlock  : toBlock
            };
            return await contract.getPastEvents('PairCreated', options);
        }
        catch (error) {
            const midBlock = (fromBlock + toBlock) >> 1; //bitshift op to find half of the blocksize
            const arr1 = await getPastEvents(address, fromBlock, midBlock, contract);
            const arr2 = await getPastEvents(address, midBlock + 1, toBlock, contract);
            return [...arr1, ...arr2];
        }
    }
    return [];
}