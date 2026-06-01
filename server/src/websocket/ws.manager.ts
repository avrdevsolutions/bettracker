import {WebSocketServer, WebSocket} from "ws";

let wssInstance: WebSocketServer;

export const setupWebSocket = (wss: WebSocketServer) => {
    wssInstance = wss;
    wss.on('connection', (ws:any) => {
        ws.isAlive = true;  // mark alive on connect
        ws.on('pong', () => { ws.isAlive = true; });  // reset on pong response
        ws.on('message', (data:any) => {
            console.log('Received:', data.toString());
        });
        ws.on('close', () => console.log('Disconnected'));
    });

    setInterval(() => {
        wss.clients.forEach((ws:any) => {
            if(!ws.isAlive) return ws.terminate()
            ws.isAlive = false;
            ws.ping()
        })
    }, 30000)
}

export const broadcast = (data: object) => {
    wssInstance.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}

