import type { GroupedPlaylistData } from "../../services/spotifyServices";
import PlaylistCover from "../../components/playlistCover";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";

const Playlists: React.FC<{
  playlists: GroupedPlaylistData;
}> = ({ playlists }) => {
  return (
    <div className="m-3 grid grid-cols-2 gap-2">
      {playlists.items.map(p => (
        <Link key={p.id} href={`/playlists/${p.id}`}>
          <PlaylistCover playlist={p} />
        </Link>
      ))}
    </div>
  );
};

export default Playlists;

import { GetStaticProps } from "next";
import { getToken, getAllPlaylists } from "../../services/spotifyServicesBrendon";
export const getStaticProps: GetStaticProps = async context => {
  const { data: token } = await getToken();
  const { data: results } = await getAllPlaylists(token.access_token);

  if (!results) {
    return {
      notFound: true,
    };
  }

  return {
    props: { playlists: results },
    revalidate: 3600,
  };
};
