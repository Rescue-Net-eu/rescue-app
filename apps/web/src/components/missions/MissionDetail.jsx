import React from 'react';
import MissionChat from './MissionChat';

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
      {/* TODO: fetch /missions/:missionId, assignment panel, resource tracker */}
      <MissionChat missionId={missionId} />
    </div>
  );
}
