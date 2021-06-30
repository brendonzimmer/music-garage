import { TransferContext, TransferProps } from "../../components/context/TransferContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

const Transfer: React.FC<{ devToken: string }> = ({ devToken }) => {
  const { setMusicKit, musicKit, setMusicUserToken, musicUserToken } = useContext<TransferProps>(TransferContext);
  const router = useRouter();

  useEffect(() => {
    async function run() {
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

    if (window.MusicKit) return run();
    if (musicKit.isAuthorized) return setMusicUserToken(musicKit.musicUserToken);
  }, [musicKit]);

  return (
    <>
      <Head>
        <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>
      </Head>

      <div className="m-3 text-white font-bold space-y-2">
        <h1 className="text-5xl text-black tracking-tight opacity-60 mb-2 rounded-md">So it's time to move?</h1>
        <p className="text-lg text-black tracking-tight opacity-60 font-semibold leading-tight">
          Transfer playlists between Spotify and Apple Music with special features such as:
        </p>
        <ul className="text-lg text-black tracking-tight opacity-60 font-semibold leading-snug list-disc list-inside">
          <li>Multiple playlists at once</li>
          <li>Correct region when adding songs</li>
          <li>Live view to watch the move in real time</li>
          <li>Search for songs not found</li>
          <li>Compare and contrast afterward</li>
        </ul>
        <hr className="border-black opacity-50 border-[1px]" />
        <div className="duration-700 ease-in-out space-y-2">
          <div className="opacity-60 flex space-x-1">
            {/* <p className="text-2xl text-black text-opacity-70 rounded-full ">1.</p> */}

            <h1 className="text-3xl">Log in to Apple Music</h1>
          </div>
          <button
            className="bg-white bg-opacity-30 px-3 py-2 rounded-md disabled:opacity-50 w-full text-black text-opacity-60 font-semibold transition duration-500 ease-in-out"
            disabled={musicUserToken}
            onClick={async () => {
              const musicUser = await musicKit.authorize();
              setMusicUserToken(musicUser);
            }}
          >
            {musicKit?.isAuthorized ? "Done" : "Log in"}
          </button>
        </div>

        {musicUserToken && (
          <div className="duration-700 ease-in-out space-y-2">
            <div className="opacity-60 flex space-x-1">
              {/* <p className="text-2xl text-black text-opacity-70 rounded-full ">2.</p> */}

              <h1 className="text-3xl">Log in to Spotify</h1>
            </div>
            <Link href="/api/login">
              <button
                onClick={() => {
                  document.querySelectorAll("button")[1].innerText = "Working...";
                  document.querySelectorAll("button")[1].disabled = true;
                }}
                className="bg-white bg-opacity-30 px-3 py-2 rounded-md disabled:opacity-50 w-full text-black text-opacity-60 font-semibold transition duration-1000 ease-in-out"
                disabled={!musicUserToken}
              >
                Log in
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Transfer;

import { GetServerSideProps } from "next";
import { createJWT } from "../../services/appleServices";
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: { devToken: createJWT() },
  };
};
