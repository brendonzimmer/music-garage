import { TransferContext, TransferProps } from "../../components/context/TransferContext";
import PlaylistCover from "../../components/playlistCover";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

const TransferPlaylists: React.FC<{
  allPlaylists: GroupedPlaylistData["items"];
  token: userTokenData["access_token"];
}> = ({ allPlaylists, token }) => {
  const { setPlaylistInfo, setToken } = useContext<TransferProps>(TransferContext);
  const router = useRouter();

  useEffect(() => {
    setToken(token);
  }, []);

  return (
    <div className="m-3">
      <h1 className="text-3xl text-white font-semibold opacity-60 my-2">Select a playlist to move to Apple Music.</h1>
      <div className="grid grid-cols-2 gap-2">
        {allPlaylists.map(p => (
          <div
            key={p.id}
            onClick={() => {
              setPlaylistInfo(p);
              router.push(`/transfer/results/${p.id}`);
            }}
          >
            <PlaylistCover key={p.id} playlist={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransferPlaylists;

import { GetServerSideProps } from "next";
import { getAllPlaylists, getUserToken, GroupedPlaylistData, userTokenData } from "../../services/spotifyServices";
export const getServerSideProps: GetServerSideProps = async context => {
  const token = await getUserToken(context);
  const allPlaylists = token ? await getAllPlaylists(token) : undefined;

  if (allPlaylists)
    return {
      props: { allPlaylists, token },
    };

  return {
    redirect: {
      destination: "/transfer",
      permanent: false,
    },
  };
};
