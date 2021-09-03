const Web3 = require("web3");
const fs = require("fs");
const options = {
    // Enable auto reconnection in case of subscription interrupt
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
  };

let poc = fs.readFile('./pair_abi.json', 'utf-8', (err, data) => { //read abi definition
    if (err){
        console.log(err)
    }else{
        let abi = JSON.parse(data);
        let web3 = new Web3(new Web3.providers.WebsocketProvider("yourProvider"), options);
          let contract = new web3.eth.Contract(abi, '0x11Dd3D621376e404a70f0835551208BF527003b3'); // second parameter is the contract adress of the corresponding abi
          contract.events.allEvents() // create contract object and tap in all Events emitted
          .on("connected", function(subscriptionId){
              console.log("CONNECTED")
              console.log(subscriptionId); //just returns subscriptionID
          })
          .on('data', function(event){ //main data feed for events
            console.log("DATA")
              console.log(event); // same results as the optional callback above
          })
          .on('changed', function(event){ //data feed for 'undone' txs such as tx reverts
            console.log("CHANGED")
            console.log(event)
              // remove event from local database here
          })
          .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log("ERROR")      
            console.log(error)
            console.log("RECEIPT")  
            console.log(receipt)
          });
          
          
    }
        
})