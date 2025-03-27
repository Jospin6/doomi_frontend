// middleware/websocketMiddleware.ts
import { Middleware } from 'redux';
import { receiveMessage } from '@/redux/message/messagingSlice';
import { store } from '@/redux/store';
import { webSocketUrl } from '@/helpers/constants';

const socket = new WebSocket(webSocketUrl);

const websocketMiddleware: Middleware = (store) => (next) => (action) => {
    // Lorsqu'un message est reçu via WebSocket
    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        if (messageData.event === 'receiveMessage') {
            store.dispatch(receiveMessage(messageData.data));
        }
    };

    // Passer l'action suivante dans le pipeline Redux
    return next(action);
};

export default websocketMiddleware;
