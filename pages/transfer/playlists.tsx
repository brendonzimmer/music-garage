import { getPlaylistTracks, GroupedPlaylistData, TrackData, userTokenData } from "../../services/spotifyServices";
import { TransferContext, TransferProps } from "../../components/context/TransferContext";
import { useRouterCaution } from "../../components/hooks/useRouterCaution";
import { useAppleMusic } from "../../components/hooks/useAppleMusic";
import PlaylistTransfer from "../../components/playlistTransfer";
import PlaylistCover from "../../components/playlistCover";
import { useContext, useEffect, useState } from "react";

const TransferPlaylists: React.FC<{
  allPlaylists: GroupedPlaylistData["items"];
  token: userTokenData["access_token"];
  devToken: string;
}> = ({ allPlaylists, token, devToken }) => {
  const [playlistInfo, setPlaylistInfo] = useState<GroupedPlaylistData["items"][0]>();
  const { Head, UnauthBlocker } = useAppleMusic({ devToken, automaticAuth: true });
  const { setToken, musicUserToken } = useContext<TransferProps>(TransferContext);
  const [tracksInfo, setTracksInfo] = useState<TrackData[]>();
  useRouterCaution();

  useEffect(() => {
    setToken(token);
  }, []);

  useEffect(() => {
    async function run() {
      if (playlistInfo) return setTracksInfo(await getPlaylistTracks(playlistInfo.id, token));
    }

    run();
  }, [playlistInfo]);

  useEffect(() => {
    if (!musicUserToken) return document.body.classList.add("overflow-hidden");
    document.body.classList.remove("overflow-hidden");
  }, [musicUserToken]);

  return (
    <>
      {Head}
      {UnauthBlocker}
      {!playlistInfo ? (
        <div className="m-3">
          <h1 className="text-3xl text-white font-semibold opacity-60 my-2">
            Select a playlist to move to Apple Music.
          </h1>
          <div className="grid grid-cols-2 gap-2">
            {allPlaylists.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  setPlaylistInfo(p);
                }}
              >
                <PlaylistCover key={p.id} playlist={p} />
              </div>
            ))}
          </div>
        </div>
      ) : tracksInfo ? (
        <PlaylistTransfer playlist={playlistInfo} backButton={setPlaylistInfo} tracks={tracksInfo} />
      ) : (
        <div>Loading...</div>
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
