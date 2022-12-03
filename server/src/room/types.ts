export interface IMessage {
  content: string;
  author?: string;
  timestamp: string;
}
export interface IRoomParams {
  roomId: string;
  peerId: string;
}

export interface IJoinRoomParams extends IRoomParams {
  userName: string;
}

export interface IUser {
  userName: string;
  peerId: string;
}
