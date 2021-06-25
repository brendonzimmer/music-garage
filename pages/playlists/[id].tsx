import type { PlaylistData } from "../../services/spotifyServices";
import { InferGetStaticPropsType } from "next";

const Playlist: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  playlist,
}: {
  playlist: PlaylistData;
}) => {
  return (
    <>
      {/* Display Playlist */}
      <div className="m-3">
        {/* Title & Image */}
        <div className="">
          <div className="p-3 bg-white bg-opacity-20 rounded-md shadow-sm">
            <div className="flex flex-col items-center">
              <img src={playlist.images[0].url} alt="Playlist Cover Image" className="rounded-lg w-[95%] shadow-sm" />
              <div className="text-[4rem] mt-1.5 leading-none font-semibold text-black text-opacity-40">
                {playlist.name}
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="text-white text-opacity-75 text-base leading-snug font-medium my-2">
            {playlist.description}
          </div>
        </div>

        {/* Display Songs */}
        <div>
          <div className="grid grid-cols-1 gap-2">
            {playlist.tracks.items.map(t => (
              <div key={t.track.id} className="flex bg-white bg-opacity-20 rounded-md items-center shadow">
                <img
                  src={t.track.album.images[0].url}
                  alt={`${t.track.name} by ${t.track.artists[0].name} Album Cover`}
                  className="w-[17.5%] min-w-[60px] rounded-l"
                />
                <div className="text-black text-opacity-60 ml-2">
                  <div className="text-sm font-medium">{t.track.name}</div>
                  <div className="text-xs">{t.track.artists[0].name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Playlist;

import { GetStaticProps } from "next";
import { getToken, getPlaylist, getAllPlaylists, tokenData } from "../../services/spotifyServices";
export async function getStaticPaths() {
  const { data: token } = await getToken<tokenData>();
  const { data: results } = await getAllPlaylists(token.access_token);

  // Get the paths we want to pre-render based on posts
  const paths = results.items.map(p => ({ params: { id: p.id } })); // [{ params: { id: "38908Qsi5FP6nDuHF3QVOQ" } }];

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: token } = await getToken<tokenData>();
  const { data: result } = await getPlaylist(params.id as string, token.access_token);

  if (!result) {
    return {
      notFound: true,
    };
  }

  return {
    props: { playlist: result },
    revalidate: 3600,
  };
};
