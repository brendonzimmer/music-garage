import { getPlaylistTracks, GroupedPlaylistData, TrackData, userTokenData } from "../../services/spotifyServices";
import { TransferContext, TransferProps } from "../../components/context/TransferContext";
import { useAppleMusic } from "../../components/hooks/useAppleMusic";
import PlaylistTransfer from "../../components/playlistTransfer";
import { useContext, useEffect, useRef, useState } from "react";
import PlaylistCover from "../../components/playlistCover";
import LoadingBar from "react-top-loading-bar";
import Loading from "../../components/loading";

const TransferPlaylists: React.FC<{
  allPlaylists: GroupedPlaylistData["items"];
  token: userTokenData["access_token"];
  devToken: string;
}> = ({ allPlaylists, token, devToken }) => {
  const [playlistInfo, setPlaylistInfo] = useState<GroupedPlaylistData["items"][0]>();
  const { Head, UnauthBlocker } = useAppleMusic({ devToken, automaticAuth: true });
  const { setToken, musicUserToken } = useContext<TransferProps>(TransferContext);
  const [tracksInfo, setTracksInfo] = useState<TrackData[]>();
  const ref = useRef(null);

  useEffect(() => {
    setToken(token);
  }, []);

  useEffect(() => {
    async function run() {
      if (playlistInfo) {
        setTracksInfo(await getPlaylistTracks(playlistInfo.id, token));
        if (playlistInfo.tracks.total < 200) {
          window.scrollTo(0, 0);
          ref.current.complete();
        }
      }
    }

    run();
  }, [playlistInfo]);

  useEffect(() => {
    if (!musicUserToken) return document.body.classList.add("overflow-hidden");
    document.body.classList.remove("overflow-hidden");
  }, [musicUserToken]);

  if (playlistInfo && playlistInfo.tracks.total > 200 && !tracksInfo) return <Loading />;

  return (
    <>
      {Head}
      {UnauthBlocker}
      <LoadingBar waitingTime={750} color="#fff" ref={ref} shadow={true} />
      {!tracksInfo ? (
        <div className="m-3 grid grid-cols-2 gap-2 xs:grid-cols-3 md:grid-cols-4 md:text-lg xl:grid-cols-5 2xl:grid-cols-6">
          <div className="p-1.5 bg-black bg-opacity-20 rounded-md shadow-sm hover:bg-opacity-[0.25] duration-100 text-xl font-medium text-white text-opacity-60 list-inside list-decimal">
            <h1 className="text-xl text-white/60 font-semibold sm:text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl">
              Select a playlist to move to Apple Music.
            </h1>
          </div>
          {allPlaylists.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setPlaylistInfo(p);
                if (p.tracks.total < 200) ref.current.continuousStart();
              }}
            >
              <PlaylistCover key={p.id} playlist={p} />
            </div>
          ))}
        </div>
      ) : (
        <PlaylistTransfer
          playlist={playlistInfo}
          backButton={[setPlaylistInfo, setTracksInfo]}
          tracks={tracksInfo}
          devToken={devToken}
        />
      )}
    </>
  );
};

export default TransferPlaylists;

import { GetServerSideProps } from "next";
import { createJWT } from "../../services/appleServices";
import { getAllPlaylists, getUserToken } from "../../services/spotifyServices";
export const getServerSideProps: GetServerSideProps = async context => {
  const token = await getUserToken(context);
  const allPlaylists = token ? await getAllPlaylists(token) : undefined;

  if (allPlaylists)
    return {
      props: { allPlaylists, token, devToken: createJWT() },
    };

  return {
    redirect: {
      destination: "/transfer",
      permanent: false,
    },
  };
};
