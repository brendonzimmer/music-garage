import { ClockIcon, MusicNoteIcon, ExternalLinkIcon, BanIcon } from "@heroicons/react/solid";
import type { PlaylistData, TrackData } from "../../services/spotifyServices";
import { date, age, SelectorArray } from "aged-cheddar";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";

const Playlist: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  playlist,
  tracks,
}: {
  playlist: PlaylistData;
  tracks: TrackData[];
}) => {
  const createdAt = date(+playlist.name, [2003, 4, 1]);
  const timeSinceCreated = age(
    [
      createdAt.getUTCFullYear(),
      (createdAt.getUTCMonth() + 1) as SelectorArray[1],
      createdAt.getUTCDate() as SelectorArray[2],
    ],
    undefined,
    {
      toString: true,
    }
  );

  function artists(song: TrackData, max?: number) {
    let artist = song.track.artists[0].name;

    for (let a = 1; a < song.track.artists.length; a++) {
      artist += ", " + song.track.artists[a].name;

      if (a === max - 1) break;
    }

    return artist;
  }

  return (
    <>
      {/* Display Playlist */}
      <div className="m-3">
        {/* Title & Image */}
        <div className="">
          <div className="p-3 bg-white bg-opacity-20 rounded-md shadow-sm">
            <div className="flex flex-col items-center">
              <img src={playlist.images[0].url} alt="Playlist Cover Image" className="rounded-lg w-[95%] shadow-sm" />
            </div>
            <div className="text-[4rem] mt-1.5 leading-none font-semibold text-black text-opacity-40 text-left flex items-center justify-between w-[95%] mx-auto">
              {playlist.name}
              <div className="flex flex-col text-sm">
                <div className="flex items-center">
                  <MusicNoteIcon className="w-4 h-4 m-1" />
                  {playlist.tracks.total} songs
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 m-1" />
                  {timeSinceCreated}
                </div>
                <Link href={playlist.external_urls.spotify}>
                  <div className="flex items-center">
                    <ExternalLinkIcon className="w-4 h-4 m-1" /> spotify
                  </div>
                </Link>
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
            {tracks.map(t => (
              <div key={t.track.id} className="flex bg-white bg-opacity-20 rounded-md items-center shadow">
                {t.track.album.images[0] ? (
                  <img
                    src={t.track.album.images[0].url}
                    alt={`${t.track.name} by ${t.track.artists[0].name} Album Cover`}
                    className="w-[17.5%] min-w-[60px] rounded-l"
                  />
                ) : (
                  <BanIcon className="w-[17.5%] min-w-[60px] text-black opacity-60" />
                )}
                <div className="text-black text-opacity-60 ml-2 overflow-hidden whitespace-nowrap">
                  <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                    {t.track.name[40] ? t.track.name.substring(0, 40) + "..." : t.track.name}
                  </div>
                  <div className="text-xs overflow-hidden overflow-ellipsis">
                    {artists(t)[50] ? artists(t).substring(0, 50) + "..." : artists(t)}
                  </div>
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

import { getToken, getAllPlaylists, tokenData } from "../../services/spotifyServices";
export async function getStaticPaths() {
  const { data: token } = await getToken<tokenData>();
  const { data: results } = await getAllPlaylists(token.access_token);

  const paths = results.items.map(p => ({ params: { id: p.id } })); // [{ params: { id: "38908Qsi5FP6nDuHF3QVOQ" } }];

  return { paths, fallback: false };
}

import { GetStaticProps } from "next";
import { getPlaylist, getPlaylistTracks } from "../../services/spotifyServices";
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: token } = await getToken<tokenData>();
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
