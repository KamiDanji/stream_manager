"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getSocket } from '@/lib/socket';
import { MobileGrid } from '@/components/layout/MobileGrid';
import { MassiveButton } from '@/components/controls/MassiveButton';
import { ThickSlider } from '@/components/controls/ThickSlider';
import { OBSCommandMessage, Layout, Streamer } from 'shared';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const router = useRouter();

  // Mock layout for initial testing (will be replaced by Firestore fetch)
  const defaultLayout: Layout = {
    id: 'default',
    name: 'Main Controls',
    isActive: true,
    gridSettings: { columns: 2 },
    buttons: [
      { id: '1', label: 'LIVE', color: 'blue', action: 'SetCurrentProgramScene', payload: { sceneName: 'Gameplay' }, order: 0 },
      { id: '2', label: 'BRB', color: 'red', action: 'SetCurrentProgramScene', payload: { sceneName: 'BRB' }, order: 1 },
      { id: '3', label: 'CHAT', color: 'green', action: 'SetCurrentProgramScene', payload: { sceneName: 'Just Chatting' }, order: 2 },
      { id: '4', label: 'MUTE MIC', color: 'red', action: 'ToggleInputMute', payload: { inputName: 'Mic/Aux' }, order: 3 },
    ],
    sliders: [
      { id: 's1', label: 'Game Audio', action: 'SetInputVolume', payload: { inputName: 'Desktop Audio' }, order: 4 },
      { id: 's2', label: 'Mic Volume', action: 'SetInputVolume', payload: { inputName: 'Mic/Aux' }, order: 5 },
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login');
        return;
      }
      setUser(u);
      
      // Attempt to find the streamer's room (mocked to user uid for now)
      // In a real app, the moderator might select a streamer from a list
      const targetRoomId = u.uid; 
      setRoomId(targetRoomId);

      // Load layout
      setLayout(defaultLayout);

      const token = await u.getIdToken();
      const s = getSocket(token);
      setSocket(s);

      s.connect();

      s.on('connect', () => {
        s.emit('joinRoom', targetRoomId, (res: { success: boolean, message?: string }) => {
          if (res.success) {
            setConnected(true);
          } else {
            console.error(res.message);
          }
        });
      });

      s.on('bridgeConnected', () => setBridgeConnected(true));
      s.on('bridgeDisconnected', () => setBridgeConnected(false));
      s.on('disconnect', () => setConnected(false));
    });

    return () => unsub();
  }, [router]);

  const sendCommand = (action: string, payload: any) => {
    if (!socket || !connected) return;
    const msg: OBSCommandMessage = {
      roomId,
      action,
      payload
    };
    socket.emit('obsCommand', msg);
  };

  if (!layout) return <div className="p-8 text-center text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-950 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Remote Control</h1>
        <div className="flex gap-2 items-center text-sm">
          <span className="text-gray-400">Bridge:</span>
          <span className={`w-3 h-3 rounded-full ${bridgeConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 p-2 md:p-6 overflow-y-auto">
        <MobileGrid columns={layout.gridSettings.columns}>
          {layout.buttons.map(btn => (
            <MassiveButton 
              key={btn.id}
              label={btn.label}
              color={btn.color}
              disabled={!connected || !bridgeConnected}
              onClick={() => sendCommand(btn.action, btn.payload)}
            />
          ))}
          {layout.sliders.map(slider => (
            <ThickSlider
              key={slider.id}
              label={slider.label}
              initialValue={100}
              onChange={(val) => {
                // Map 0-100 to OBS volume format (e.g. 0.0 to 1.0 or dB)
                // Assuming payload defines the inputName
                sendCommand(slider.action, { ...slider.payload, inputVolumeDb: (val - 100) * 0.5 }); // rough dB mapping placeholder
              }}
            />
          ))}
        </MobileGrid>
      </div>
    </div>
  );
}
