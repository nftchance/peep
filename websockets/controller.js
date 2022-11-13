const web3 = require('web3');

const webSocketServer = require('websocket').server;
const http = require('http');

const RPC_URL = "wss://eth-mainnet.g.alchemy.com/v2/8vW9cvJTfUhAAqcNeM7uW17Fhb7nGqQX";

class WebsocketController {
    constructor(port) {
        this.web3 = new web3(new web3.providers.WebsocketProvider(RPC_URL));

        this.port = port;
        this.clients = {};

        this.initialize();
    }

    initialize = () => { 
        this.httpServer = http.createServer();
        this.httpServer.listen(this.port, () => {
            console.log((new Date()) + " Server is listening on port "
                + this.port);
        });
        this.wsServer = new webSocketServer({
            httpServer: this.httpServer
        });
    }

    // This code generates unique userid for everyuser.
    getUniqueID() {
        const s4 = () => Math.floor(
            (1 + Math.random()) * 0x10000
        ).toString(16).substring(1);

        return s4() + s4() + '-' + s4();
    }
    
    sendToAll = (message) => {
        for (let key in this.clients) {
            this.clients[key].sendUTF(message);
        }
    }

    open = () => { 
        this.wsServer.on('request', (request) => {
            var userID = this.getUniqueID();
            console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

            // You can rewrite this part of the code to accept only the requests from allowed origin
            const connection = request.accept(null, request.origin);
            this.clients[userID] = connection;
            
            console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(this.clients))
        });

        // This code is executed when a particular user closes his connection
        this.wsServer.on('close', (connection) => {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
        });
    }

    chainSubscribe = (subscription) => {
        this.web3.eth.subscribe(subscription, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                this.sendToAll(JSON.stringify({
                    subscription: subscription,
                    result: result
                }));
            }
        });
    }

    contractSubscribe = (subscription, config) => {
        this.web3.eth.subscribe(subscription, config, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                this.sendToAll(JSON.stringify({
                    subscription: subscription,
                    result: result
                }));
            }
        });
    }

    run = () => {
        // Keep the block data up to date
        this.chainSubscribe('newBlockHeaders');

        // // listen to every block event
        // this.web3.eth.subscribe('newBlockHeaders', (error, result) => {
        //     if (!error) {
        //         this.sendToAll(JSON.stringify({
        //             name: 'block',
        //             ...result
        //         }));
        //     }
        // })
        // .on("data", (blockHeader) => {
        //     console.log(blockHeader);
        // })
        // .on("error", console.error);
    }
}

module.exports = {
    WebsocketController
}