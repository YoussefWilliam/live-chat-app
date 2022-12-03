import { ADD_PEER, ADD_PEER_NAME, REMOVE_PEER } from "./peerActions";

export type PeerState = Record<
  string,
  { stream: MediaStream; userName?: string }
>;
export type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    }
  | {
      type: typeof ADD_PEER_NAME;
      payload: { peerId: string; userName: string };
    };
export const peerReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    case ADD_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          userName: action.payload.userName,
        },
      };

    case REMOVE_PEER:
      const { [action.payload.peerId]: deletedPeer, ...restOfPeers } = state;
      return restOfPeers;

    default:
      return { ...state };
  }
};
