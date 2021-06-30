import { createContext, Dispatch, SetStateAction, useState } from "react";
import { GroupedPlaylistData, PlaylistData } from "../../services/spotifyServices";

// Context
export const TransferContext = createContext(null);

// Type
export interface TransferProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  playlistInfo: GroupedPlaylistData["items"][0] | PlaylistData;
  setPlaylistInfo: Dispatch<SetStateAction<GroupedPlaylistData["items"][0]>>;
}

// Provider
export const TransferProvider = ({ children }) => {
  // Menu Toggle Ref
  const [token, setToken] = useState<string>();
  const [playlistInfo, setPlaylistInfo] = useState<GroupedPlaylistData["items"][0] | PlaylistData>();

  const TransferProps = {
    token,
    setToken,
    playlistInfo,
    setPlaylistInfo,
  };

  return <TransferContext.Provider value={TransferProps}>{children}</TransferContext.Provider>;
};
