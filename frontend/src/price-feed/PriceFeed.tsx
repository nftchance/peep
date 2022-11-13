import { useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';

interface Block { 
    name: string;
    baseFeePerGas: number;
    difficulty: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    hash: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nonce: string;
    number: number;
    parentHash: string;
    receiptsRoot: string;
    sha3Uncles: string;
    size: number;
    stateRoot: string;
    timestamp: number;
    transactionsRoot: string;
}

const PriceFeed = ({ 
    client 
}: { 
    client: w3cwebsocket
}) => {
    const [block, setBlock] = useState<any>(null);
    const [coins, setCoins] = useState([])

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message: any) => {
            const dataFromServer = JSON.parse(message.data);
            console.log(dataFromServer)

            if (dataFromServer.subscription === 'newBlockHeaders') 
                setBlock(dataFromServer.result)
            else if(dataFromServer.subscription === 'price_feed')
                setCoins(dataFromServer.result)
        };
    })

    return (
        <>
            <div className="price-feed">
                <h5>Block: {block?.number} {block?.timestamp}</h5>
                <h1>Price Feed</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map((coin: any) => (
                            <tr key={coin.symbol}>
                                <td>{coin.symbol}</td>
                                <td>{coin.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PriceFeed;