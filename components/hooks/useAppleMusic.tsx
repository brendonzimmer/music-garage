import { TransferContext, TransferProps } from "../context/TransferContext";
import { useContext, useEffect } from "react";
import Head from "next/head";

export const useAppleMusic = ({ devToken, automaticAuth }: UseAppleMusicProps) => {
  const { setMusicKit, musicKit, setMusicUserToken, musicUserToken } = useContext<TransferProps>(TransferContext);

  useEffect(() => {
    if (window.MusicKit) return setup() as any;
    if (automaticAuth) return authorizeHandler();
    if (musicKit?.isAuthorized) return setMusicUserToken(musicKit.musicUserToken);
  }, [musicKit]);

  // local function
  async function setup() {
    await window.MusicKit.configure({
      developerToken: devToken,
      storefrontId: "us",
      app: {
        name: "My Cool Web App",
        build: "1978.4.1",
      },
    });
    setMusicKit(MusicKit.getInstance());
    delete window.MusicKit; // clear global scope
  }

  // local and exported
  async function authorizeHandler() {
    const musicUser = await musicKit.authorize();
    setMusicUserToken(musicUser);
  }

  return {
    Head: !musicKit ? (
      <Head>
        <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>
      </Head>
    ) : (
      <></>
    ),
    UnauthBlocker: !musicUserToken && (
      <div className="absolute grid place-items-center left-0 top-0 w-[100vw] h-[100vh] bg-black/50 text-white/90 font-semibold">
        <div className="flex flex-col justify-center space-y-2 ">
          <h1>Please log in to Apple Music to continue.</h1>
          <button
            className="bg-white/90 px-3 py-2 rounded-md w-[100%] text-black text-opacity-60 font-semibold transition duration-500 ease-in-out"
            onClick={authorizeHandler}
          >
            {musicKit?.isAuthorized ? "Done" : "Log in"}
          </button>
        </div>
      </div>
    ),
    manualAuthorizeHandler: authorizeHandler,
  };
};

// Types
export interface UseAppleMusicProps {
  devToken: string;
  automaticAuth: boolean;
}
