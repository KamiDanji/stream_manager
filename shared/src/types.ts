// User and Room Database schema types
export interface Streamer {
  uid: string;
  email: string;
  displayName: string;
  streamerRoomId: string;
  moderators: string[];
  createdAt: number; // timestamp
}

export interface ButtonLayout {
  id: string;
  label: string;
  color: string;
  action: string;
  payload: Record<string, any>;
  order: number;
}

export interface SliderLayout {
  id: string;
  label: string;
  action: string;
  payload: Record<string, any>;
  order: number;
}

export interface Layout {
  id: string;
  name: string;
  isActive: boolean;
  gridSettings: {
    columns: number;
  };
  buttons: ButtonLayout[];
  sliders: SliderLayout[];
}

// WebSocket Payload types
export interface OBSCommandMessage {
  roomId: string;
  action: string;
  payload: Record<string, any>;
}
