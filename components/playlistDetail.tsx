import { ClockIcon, MusicNoteIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import type { PlaylistData, TrackData } from "../services/spotifyServices";
import { date, age, SelectorArray } from "aged-cheddar";
import Track from "./track";
import { useEffect, useState } from "react";

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
              {name}
              <div className="flex flex-col text-sm">
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
            </div>
          </div>

          {/* Description */}
          <div className="text-white text-opacity-75 text-base leading-snug font-medium my-2">{desc}</div>
        </div>

        {/* Display Songs */}
        <div>
          <div className="grid grid-cols-1 gap-2">
            {tracks.map(t => (
              <Track track={t} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistDetail;
