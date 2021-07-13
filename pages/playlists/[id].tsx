import type { PlaylistData, TrackData } from "../../services/spotifyServices";
import PlaylistDetail from "../../components/playlistDetail";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef } from "react";

const Playlist: React.FC<{
  playlist: PlaylistData;
  tracks: TrackData[];
}> = ({ playlist, tracks }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.complete();
  }, [ref.current]);

  return (
    <>
      <LoadingBar loaderSpeed={750} color="#fff" ref={ref} shadow={true} />
      <PlaylistDetail playlist={playlist} tracks={tracks} />
    </>
  );
};

export default Playlist;

import { getToken, getAllPlaylists } from "../../services/spotifyServicesBrendon";
export async function getStaticPaths() {
  const { data: token } = await getToken();
  const { data: results } = await getAllPlaylists(token.access_token);

  const paths = results.items.map(p => ({ params: { id: p.id } })); // [{ params: { id: "38908Qsi5FP6nDuHF3QVOQ" } }];

  return { paths, fallback: false };
}

import { GetStaticProps } from "next";
import { getPlaylist, getPlaylistTracks } from "../../services/spotifyServicesBrendon";
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: token } = await getToken();
  const { data: result } = await getPlaylist(params.id as string, token.access_token);

  let tracks = await getPlaylistTracks(params.id as string, token.access_token, 0);
  let next = tracks.data.next;
  let offset = 100;
  while (offset < result.tracks.total) {
    const res = await getPlaylistTracks(params.id as string, token.access_token, offset);
    tracks.data.items.push(...res.data.items);
    next = res.data.next;
    offset += 100;
  }

  if (!result) {
    return {
      notFound: true,
    };
  }

  return {
    props: { playlist: result, tracks: tracks.data.items },
    revalidate: 3600,
  };
};
