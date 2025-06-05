import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function MissionChat({ missionId }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const s = io('/missions');
    s.emit('join', missionId);
    s.on('message', (msg) => setMessages((m) => [...m, msg]));
    setSocket(s);
    return () => s.disconnect();
  }, [missionId]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('message', { missionId, message, user: 'Me' });
      setMessage('');
    }
  };

  return (
    <div>
      <div className="border h-40 overflow-y-auto mb-2 p-2">
        {messages.map((m, idx) => (
          <div key={idx}>{m.user}: {m.message}</div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border p-2 flex-grow"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <button className="ml-2" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
