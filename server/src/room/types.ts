export interface IMessage {
  content: string;
  author?: string;
  timestamp: string;
}
export interface IRoomParams {
  roomId: string;
  peerId: string;
}
