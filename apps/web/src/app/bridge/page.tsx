"use client";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { connectOBS, disconnectOBS, getOBSClient } from '@/lib/obs';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { OBSCommandMessage } from 'shared';

export default function BridgePage() {
  const [obsPassword, setObsPassword] = useState('');
  const [obsUrl, setObsUrl] = useState('ws://127.0.0.1:4455');
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
    });
    return () => unsub();
  }, []);

  const handleConnect = async () => {
    if (!user) {
      addLog('Error: Not authenticated with Firebase. Streamer must be logged in.');
      return;
    }
    
    setStatus('connecting');
    addLog(`Connecting to OBS at ${obsUrl}...`);
    
    try {
      await connectOBS(obsPassword, obsUrl);
      addLog('Successfully connected to local OBS.');

      const token = await user.getIdToken();
      const socket = getSocket(token);
      
      socket.connect();
      
      socket.on('connect', () => {
        addLog('Connected to Cloud Router.');
        // Join the streamer's own room (roomId = user.uid by default, or mapped in DB)
        socket.emit('joinRoom', user.uid, (res: { success: boolean, message?: string }) => {
          if (res.success) {
            addLog(`Joined Cloud Room: ${user.uid}`);
            setStatus('connected');
          } else {
            addLog(`Failed to join room: ${res.message}`);
            setStatus('disconnected');
            socket.disconnect();
          }
        });
      });

      socket.on('executeObsCommand', async (data: OBSCommandMessage) => {
        addLog(`Received command: ${data.action}`);
        const obs = getOBSClient();
        try {
          await obs.call(data.action as any, data.payload);
          addLog(`Executed: ${data.action} successfully.`);
        } catch (error: any) {
          addLog(`Command failed: ${error.message}`);
        }
      });

      socket.on('disconnect', () => {
        addLog('Disconnected from Cloud Router.');
        setStatus('disconnected');
      });

    } catch (error: any) {
      addLog(`Connection failed: ${error.message}`);
      setStatus('disconnected');
    }
  };

  const handleDisconnect = async () => {
    await disconnectOBS();
    disconnectSocket();
    setStatus('disconnected');
    addLog('Disconnected manually.');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-4">OBS Bridge Page</h1>
      <p className="mb-8 text-gray-400">Keep this page open in the background to relay cloud commands to your local OBS.</p>
      
      {!user && <p className="text-red-400 mb-4">Please log in first before starting the bridge.</p>}

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col gap-4 mb-4">
          <label>
            OBS WebSocket URL
            <input 
              type="text" 
              className="w-full mt-1 p-3 bg-gray-700 rounded text-white outline-none" 
              value={obsUrl} 
              onChange={e => setObsUrl(e.target.value)} 
              disabled={status !== 'disconnected'}
            />
          </label>
          <label>
            OBS WebSocket Password
            <input 
              type="password" 
              className="w-full mt-1 p-3 bg-gray-700 rounded text-white outline-none" 
              value={obsPassword} 
              onChange={e => setObsPassword(e.target.value)} 
              disabled={status !== 'disconnected'}
            />
          </label>
        </div>
        
        {status === 'disconnected' ? (
          <button 
            onClick={handleConnect}
            disabled={!user}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold disabled:opacity-50"
          >
            Connect Bridge
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded font-bold"
          >
            Disconnect Bridge
          </button>
        )}
      </div>

      <div className="bg-black p-4 rounded-xl font-mono text-sm h-64 overflow-y-auto border border-gray-800">
        <p className="text-gray-500 mb-2">// Bridge Logs</p>
        {logs.map((log, i) => (
          <div key={i} className="text-green-400">{log}</div>
        ))}
      </div>
    </div>
  );
}
