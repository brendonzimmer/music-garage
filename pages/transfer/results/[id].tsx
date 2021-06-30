import { getPlaylist, getUserToken, TrackData, userTokenData } from "../../../services/spotifyServices";
import { TransferContext, TransferProps } from "../../../components/context/TransferContext";
import PlaylistTransfer from "../../../components/playlistTransfer";
import { useContext, useEffect } from "react";

const Results: React.FC<{
  id: string;
  tracks: TrackData[];
  token: userTokenData["access_token"];
}> = ({ id, tracks, token }) => {
  const { playlistInfo, setPlaylistInfo, setToken } = useContext<TransferProps>(TransferContext);

  useEffect(() => {
    async function run() {
      setToken(token);

      if (!playlistInfo) {
        const result = await getPlaylist(id, token);

        setPlaylistInfo(result);
      }
    }

    run();
  });

  return <PlaylistTransfer playlist={playlistInfo} tracks={tracks} />;
};

export default Results;

import { GetServerSideProps } from "next";
import { getPlaylistTracks } from "../../../services/spotifyServices";
export const getServerSideProps: GetServerSideProps = async context => {
  const token = await getUserToken(context);

  const tracks = token ? await getPlaylistTracks(context.params.id as string, token) : undefined;

  if (tracks) {
    return {
      props: { id: context.params.id, tracks, token },
    };
  }

  return {
    notFound: true,
  };
};
