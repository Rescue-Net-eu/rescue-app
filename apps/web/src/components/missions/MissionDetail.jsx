import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function MissionDetail({ missionId }) {
  const [mission, setMission] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetch(`/api/missions/${missionId}`)
      .then((res) => res.json())
      .then((data) => setMission(data));

    socketRef.current = io('/missions');
    socketRef.current.emit('joinMission', missionId);
    socketRef.current.on('missionMessage', (msg) => {
      if (msg.missionId === missionId) {
        setMessages((m) => [...m, msg]);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [missionId]);

  const sendMessage = () => {
    if (!text) return;
    socketRef.current.emit('missionMessage', { missionId, message: text });
    setText('');
  };

  return (
    <div className="container mx-auto py-8">
      {mission ? (
        <>
          <h2 className="text-2xl font-bold mb-2">{mission.title}</h2>
          <p className="mb-4">{mission.description}</p>
          <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className="mb-1">
                {m.user ? <strong>{m.user}: </strong> : null}
                {m.message}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Type a message"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
