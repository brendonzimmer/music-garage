import { GroupedPlaylistData, PlaylistData, TrackData } from "../services/spotifyServices";
import { MusicNoteIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import TrackCompare from "./trackCompare";
import { useEffect } from "react";
import { useState } from "react";

const PlaylistDetail: React.FC<{
  playlist: PlaylistData | GroupedPlaylistData["items"][0];
  tracks: TrackData[];
}> = ({ playlist, tracks }) => {
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
              <img src={playlist?.images[0].url} alt="Playlist Cover Image" className="rounded-lg w-[95%] shadow-sm" />
            </div>
            <div className="text-[2rem] mt-1.5 leading-none font-semibold text-black text-opacity-40 text-left flex items-center justify-between w-[95%] mx-auto">
              {name}
              <div className="flex flex-col text-sm">
                <div className="flex items-center">
                  <MusicNoteIcon className="w-4 h-4 m-1" />
                  {playlist?.tracks.total} songs
                </div>
                <a target="_blank" href={playlist?.external_urls.spotify} rel="noopener noreferrer">
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

        <TrackCompare tracks={tracks} />
      </div>
    </>
  );
};

export default PlaylistDetail;
