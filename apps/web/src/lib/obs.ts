import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

export const connectOBS = async (password: string, url = 'ws://127.0.0.1:4455') => {
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(url, password, {
      rpcVersion: 1
    });
    console.log(`Connected to OBS v${obsWebSocketVersion} (using RPC v${negotiatedRpcVersion})`);
    return true;
  } catch (error: any) {
    console.error('Failed to connect to OBS', error.code, error.message);
    throw error;
  }
};

export const disconnectOBS = async () => {
  await obs.disconnect();
};

export const getOBSClient = () => obs;
