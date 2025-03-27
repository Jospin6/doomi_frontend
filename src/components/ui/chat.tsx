"use client"
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations, sendMessage } from '@/redux/message/messagingSlice';
import { RootState } from '@/redux/store';
import { AppDispatch } from '@/redux/store';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, selectedConversation, status } = useSelector((state: RootState) => state.messaging);
  const [message, setMessage] = useState('');
  const user = useCurrentUser()

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations(user.id!));
    }
  }, [dispatch, user]);

  const handleSendMessage = () => {
    if (selectedConversation && message.trim() && user) {
      dispatch(sendMessage({
        conversationId: selectedConversation.id,
        message,
        senderId: user!.id!,
      }));
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Liste des conversations */}
      <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {status === 'loading' ? (
          <p>Chargement...</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
              onClick={() => dispatch({ type: 'messaging/selectConversation', payload: conv })}
            >
              {conv.name || 'Conversation'}
            </div>
          ))
        )}
      </div>
      
      {/* Fenêtre de chat */}
      <div className="w-2/3 flex flex-col bg-white border-l">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b text-lg font-bold">{selectedConversation.name || 'Chat'}</div>
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`mb-2 p-2 rounded ${msg.senderId === user!.id! ? 'bg-blue-200 self-end' : 'bg-gray-200'}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Écrire un message..."
              />
              <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">
                Envoyer
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
