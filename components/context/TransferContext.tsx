import { createContext, Dispatch, SetStateAction, useState } from "react";

// Context
export const TransferContext = createContext(null);

// Type
export interface TransferProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  musicKit: MusicKit.MusicKitInstance;
  setMusicKit: Dispatch<SetStateAction<MusicKit.MusicKitInstance>>;
  musicUserToken: string;
  setMusicUserToken: Dispatch<SetStateAction<string>>;
}

// Provider
export const TransferProvider = ({ children }) => {
  // Menu Toggle Ref
  const [token, setToken] = useState<string>();
  const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>();
  const [musicUserToken, setMusicUserToken] = useState<any>();

  const TransferProps = {
    token,
    setToken,
    musicKit,
    setMusicKit,
    musicUserToken,
    setMusicUserToken,
  };

  return <TransferContext.Provider value={TransferProps}>{children}</TransferContext.Provider>;
};
