import { w3cwebsocket } from "websocket";

import PriceFeed from "./price-feed/PriceFeed";

import './App.css'

const client = new w3cwebsocket('ws://127.0.0.1:8000');

function App() {
	return (
		<>
			<div className="App">
				<PriceFeed client={client} />
			</div>
		</>
	)
}

export default App
