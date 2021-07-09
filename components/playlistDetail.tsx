import { ClockIcon, MusicNoteIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import type { PlaylistData, TrackData } from "../services/spotifyServices";
import { date, age, SelectorArray } from "aged-cheddar";
import { useEffect, useState } from "react";
import Track from "./track";

const PlaylistDetail: React.FC<{
  playlist: PlaylistData;
  tracks: TrackData[];
}> = ({ playlist, tracks }) => {
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

  const [name, setName] = useState(playlist?.name);
  const [desc, setDesc] = useState(playlist?.description);

  useEffect(() => {
    const parser = new DOMParser();
    setName(parser.parseFromString(`<!doctype html><body>${playlist?.name || ""}`, "text/html").body.textContent);
    setDesc(
      parser.parseFromString(`<!doctype html><body>${playlist?.description || ""}`, "text/html").body.textContent
    );
  }, [playlist]);

  const HEADER_INFO_UNDER_MD = (
    <div className="flex flex-col text-sm lg:hidden">
      <div className="flex items-center">
        <MusicNoteIcon className="w-4 h-4 m-1" />
        {playlist.tracks.total} songs
      </div>
      <div className="flex items-center">
        <ClockIcon className="w-4 h-4 m-1" />
        {timeSinceCreated}
      </div>
      <a target="_blank" href={playlist.external_urls.spotify} rel="noopener noreferrer">
        <div className="flex items-center">
          <ExternalLinkIcon className="w-4 h-4 m-1" /> spotify
        </div>
      </a>
    </div>
  );

  const HEADER_INFO_MD_ABOVE = (
    <div className="hidden lg:grid place-items-center gap-3 grid-cols-3 text-sm leading-none font-semibold text-black/40 text-center">
      <div className="flex items-center justify-center h-full bg-white/20 rounded-md shadow px-3 py-2 w-full">
        <MusicNoteIcon className="w-4 h-4 m-1" />
        {playlist.tracks.total} songs
      </div>
      <div className="flex items-center justify-center h-full bg-white/20 rounded-md shadow px-3 py-2 w-full">
        <ClockIcon className="w-4 h-4 m-1" />
        {timeSinceCreated} ago
      </div>
      <a
        target="_blank"
        href={playlist.external_urls.spotify}
        rel="noopener noreferrer"
        className="bg-white/20 rounded-md shadow px-3 py-2 w-full h-full"
      >
        <div className="flex items-center justify-center">
          <ExternalLinkIcon className="w-4 h-4 m-1" /> spotify
        </div>
      </a>
    </div>
  );

  return (
    <>
      {/* Display Playlist */}
      <div className="m-3 grid place-items-center lg:grid-cols-5 lg:gap-3 xl:grid-cols-9">
        {/* Title & Image */}
        <div className="xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:max-w-full lg:sticky lg:top-3 lg:col-span-2 lg:place-self-start xl:col-span-3 2xl:col-span-2">
          <div className="p-3 bg-white bg-opacity-20 rounded-md shadow-sm">
            <div className="flex flex-col items-center">
              <img src={playlist.images[0].url} alt="Playlist Cover Image" className="rounded-lg w-[95%] shadow-sm" />
            </div>
            <div className="text-[4rem] mt-1.5 leading-none font-semibold text-black/40 text-left flex items-center justify-between w-[95%] mx-auto lg:block lg:text-center">
              {name}
              {HEADER_INFO_UNDER_MD}
            </div>
          </div>
          <div className="hidden mt-2 lg:grid w-full justify-start">{HEADER_INFO_MD_ABOVE}</div>

          {/* Description */}
          <div className="text-white text-opacity-75 text-base leading-snug font-medium my-2 line-clamp-2 xs:line-clamp-3 lg:line-clamp-none lg:pr-1">
            {desc}
          </div>
        </div>

        {/* Display Songs */}
        {/* Add way to load songs 100 at a time. Click button at bottom to load more. */}
        <div className="xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:max-w-full lg:col-span-3 xl:col-span-6 2xl:col-span-7">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
            {tracks.map(t => (
              <Track key={t.track.id} track={t} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistDetail;
