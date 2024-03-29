import type { GroupedPlaylistData } from "../../services/spotifyServices";
import PlaylistCover from "../../components/playlistCover";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import { useRef } from "react";

const Playlists: React.FC<{
  playlists: GroupedPlaylistData;
}> = ({ playlists }) => {
  const router = useRouter();
  const ref = useRef(null);

  return (
    <>
      <LoadingBar color="#fff" ref={ref} shadow={true} />
      <div className="m-3 grid grid-cols-2 gap-2 xs:grid-cols-3 md:grid-cols-4 md:text-lg xl:grid-cols-5 2xl:grid-cols-6">
        <div className="p-1.5 bg-black bg-opacity-20 rounded-md shadow-sm hover:bg-opacity-[0.25] duration-100 text-xl font-medium text-white text-opacity-60 list-inside list-decimal">
          <span>Welcome! These are my playlists. </span>
          <span className="hidden sm:inline">They are named by the age I was when I first listened to them. </span>
          <span className="hidden lg:inline">
            Each cover photo shows an image during the time period along with the feelings brought.{" "}
          </span>
          <span className="hidden xl:inline">This is an ongoing piece of art.</span>
        </div>
        {playlists.items.map(p => (
          <div
            onClick={() => {
              ref?.current?.continuousStart();
              router.push(`/playlists/${p.id}`);
            }}
            key={p.id}
          >
            <PlaylistCover playlist={p} />
          </div>
        ))}
      </div>
    </>
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
