import type { GroupedPlaylistData } from "../../services/spotifyServices";
import type { InferGetStaticPropsType } from "next";
import { MusicNoteIcon } from "@heroicons/react/solid";
import Link from "next/link";

const Playlists: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  playlists,
}: {
  playlists: GroupedPlaylistData;
}) => {
  return (
    <div className="m-3 grid grid-cols-2 gap-2">
      {playlists.items.map(p => (
        <Link key={p.id} href={`/playlists/${p.id}`}>
          <div className="p-1.5 bg-white bg-opacity-20 rounded-md shadow-sm">
            <img src={p.images[0].url} alt={`${p.name} Playlist Cover Image`} className="rounded-lg shadow-sm" />
            <div className="flex justify-between items-end mx-0.5">
              <div className="mt-0.5 -mb-0.5 font-medium text-black text-opacity-40">{p.name}</div>
              <div className="text-xs font-medium text-black text-opacity-40 flex items-center">
                {p.tracks.total}
                <MusicNoteIcon className="w-3 h-3 ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Playlists;

import { GetStaticProps } from "next";
import { getToken, getAllPlaylists, tokenData } from "../../services/spotifyServices";
export const getStaticProps: GetStaticProps = async context => {
  const { data: token } = await getToken<tokenData>();
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
