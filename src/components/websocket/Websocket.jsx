import React, {useState, useEffect} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const Websocket = () => {
    const [userDoBet, setUserDoBet] = useState(false);
    const [found, setFound] = useState(false);
    let wsClient;

    const wallets = [
        "0xa28eE13E68B31F3C4d4164e0C0db98BCb2Ef0cF8",
        "0x987fa83115c1212A6C7044636ff098a3C9e98Ed2",
        "0xE500d12aCF03A4c521ef2A9b31FeF3d3aD0EA6C3",
        "0x1f4955A0177FeE7134FD5b91b1f7fa64fA590E51",
        "0x4bBf80604e4cf78db8043302F14E4C365411c384",
        "0xAB0067d535C861E498a10555E6bbC90AC61B7E69",
        "0x2C166fa0698bcceb5eB4732b1DbD77d56F397Aa9",
        "0x40a58032939d0B31c192d70776e00783baeeAbAF",
        "0xC259A41770f5A4eEDc70EA3FB2Fe95409C7584D4",
    ]


    const usedWallet = wallets[randomNumber(0, 7)]

    useEffect(() => {

        wsClient = new W3CWebSocket('wss://api.lifegames.es/ws/' + usedWallet);
        wsClient.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        wsClient.onmessage = (message) => {
            console.log("onmessage");
            const messageData = message.data;
            let parsedData = undefined;

            if (message.data) {

                console.log({
                    messageData
                })

                try {
                     parsedData = JSON.parse(message.data);
                } catch (error) {
                    console.log("no parseable data")
                }

                console.log({
                    parsedData
                })

                if (parsedData !== undefined) {

                    // bet
                    if (parsedData.type === "MatchOpponent" &&
                        parsedData.action === "Looking" &&
                        parsedData.data === "Looking") {
                        setUserDoBet(true);
                    }

                    if (parsedData.type === "MatchOpponent" &&
                        parsedData.action === "Found") {
                       setFound(true);
                    }
                }
            }
        };
        wsClient.onclose = (message) => {
            console.log("onclose");
            console.log(message);
        };
    });

    const betClick = () => {
        console.log("betClick");

        // send amount
        wsClient.send(10);
    }

    return <div>


        {userDoBet ? (
            <div>
                {found ? (
                    <span>Found Opponent: </span>
                ) : (
                    <span>looking</span>
                )
                }
            </div>
        ) : (
            <button onClick={betClick}>
                Bet 10
            </button>
        )
        }
    </div>;
}
export default Websocket;