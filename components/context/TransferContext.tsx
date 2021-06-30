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
  musicKit: MusicKit.MusicKitInstance;
  setMusicKit: Dispatch<SetStateAction<MusicKit.MusicKitInstance>>;
  musicUserToken: any;
  setMusicUserToken: Dispatch<SetStateAction<any>>;
}

// Provider
export const TransferProvider = ({ children }) => {
  // Menu Toggle Ref
  const [token, setToken] = useState<string>();
  const [playlistInfo, setPlaylistInfo] = useState<GroupedPlaylistData["items"][0] | PlaylistData>();
  const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>();
  const [musicUserToken, setMusicUserToken] = useState<any>();

  const TransferProps = {
    token,
    setToken,
    playlistInfo,
    setPlaylistInfo,
    musicKit,
    setMusicKit,
    musicUserToken,
    setMusicUserToken,
  };

  return <TransferContext.Provider value={TransferProps}>{children}</TransferContext.Provider>;
};
