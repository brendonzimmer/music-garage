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
          <div className="p-2 bg-white bg-opacity-20 rounded-md shadow-sm max-h-[25vh]">
            <div className="flex items-start text-[1.75rem] leading-none font-semibold text-black/40 space-x-2">
              <img
                src={playlist?.images[0].url}
                alt="Playlist Cover Image"
                className="rounded-lg min-w-[25%] max-w-[40%] max-h-[25vh] shadow-sm"
              />
              <div className="flex flex-col items-center w-[70%] my-auto space-y-2">
                <div className="line-clamp-2 text-center">{name}</div>
                <div className="flex text-sm">
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
          </div>

          {/* Description */}
          <div className="text-white/70 text-[0.90rem] leading-[1.1rem] pb-0.5 font-medium my-1 line-clamp-1">
            {desc}
          </div>
        </div>

        <TrackCompare tracks={tracks} />
      </div>
    </>
  );
};

export default PlaylistDetail;
