import { TransferContext, TransferProps } from "../../components/context/TransferContext";
import { useAppleMusic } from "../../components/hooks/useAppleMusic";
import { useContext } from "react";
import Link from "next/link";

const Transfer: React.FC<{ devToken: string }> = ({ devToken }) => {
  const { Head, manualAuthorizeHandler } = useAppleMusic({ devToken, automaticAuth: false });
  const { musicKit, musicUserToken } = useContext<TransferProps>(TransferContext);

  return (
    <>
      {Head}
      <div className="m-3 text-white font-bold space-y-2">
        <div className="bg-white/20 py-2 px-3 rounded-md">
          <h1 className="text-5xl text-black tracking-tight opacity-60 mb-2 rounded-md">So it's time to move?</h1>
          <p className="text-lg text-black tracking-tight opacity-60 font-semibold leading-tight md:hidden lg:block lg:my-3 lg:text-3xl lg:tracking-normal">
            Transfer playlists between Spotify and Apple Music with special features such as:
          </p>
          <ul className="text-lg text-black tracking-tight opacity-60 font-semibold leading-snug list-disc list-inside md:hidden lg:block">
            <li>Multiple playlists at once</li>
            <li>Correct region when adding songs</li>
            <li>Live view to watch the move in real time</li>
            <li>Search for songs not found</li>
            <li>Compare and contrast afterward</li>
          </ul>
        </div>
        <div className="space-y-2 duration-700 ease-in-out bg-black/20 p-2 rounded-md md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
          <div className="space-y-2">
            <div className="opacity-60 flex space-x-1">
              <h1 className="text-3xl">Log in to Apple Music</h1>
            </div>
            <button
              className="bg-white bg-opacity-30 px-3 py-2 rounded-md disabled:opacity-50 w-full text-black text-opacity-60 font-semibold transition duration-500 ease-in-out lg:py-5"
              disabled={!!musicUserToken}
              onClick={manualAuthorizeHandler}
            >
              {musicKit?.isAuthorized ? "Done" : "Log in"}
            </button>
          </div>
          <div className={`space-y-2 ${!musicUserToken ? "opacity-50" : ""}`}>
            <div className="opacity-60 flex space-x-1">
              <h1 className="text-3xl">Log in to Spotify</h1>
            </div>
            <Link href="/api/login">
              <button
                id="disabler"
                onClick={() => {
                  document.querySelectorAll("button")[1].innerText = "Working...";
                  document.querySelector("#disabler").classList.add("opacity-50");
                }}
                className="bg-white bg-opacity-30 px-3 py-2 rounded-md w-full text-black/60 font-semibold transition duration-1000 ease-in-out lg:py-5"
              >
                Log in
              </button>
            </Link>
          </div>
          <div className="hidden col-span-2 bg-white/40 py-2 px-3 rounded-md md:block lg:hidden">
            <h1 className="text-3xl text-black/60 font-semibold mb-2.5">
              Transfer playlists between Spotify and Apple Music with special features such as:
            </h1>
            <ul className="text-lg text-black/60 tracking-tight font-semibold leading-snug list-disc list-inside">
              <li>Multiple playlists at once</li>
              <li>Correct region when adding songs</li>
              <li>Live view to watch the move in real time</li>
              <li>Search for songs not found</li>
              <li>Compare and contrast afterward</li>
            </ul>
          </div>
        </div>
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
