import { GroupedPlaylistData, TrackData } from "../services/spotifyServices";
import { MusicNoteIcon, ExternalLinkIcon, ArrowSmLeftIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction, useEffect } from "react";
import TrackCompare from "./trackCompare";
import { useState } from "react";

const PlaylistDetail: React.FC<{
  playlist: GroupedPlaylistData["items"][0];
  tracks: TrackData[];
  backButton: Dispatch<SetStateAction<GroupedPlaylistData["items"][0]>>;
}> = ({ playlist, tracks, backButton }) => {
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

      {/* Back Button */}
      <button
        className="absolute bottom-0 left-0 m-4 px-3 py-2 w-[20%] bg-black/40 text-white/70 font-semibold rounded-[0.75rem] flex justify-center"
        onClick={() => {
          backButton(undefined);
          tracks = undefined;
        }}
      >
        <ArrowSmLeftIcon className="w-6 h-6" />
      </button>
      <button
        className="absolute bottom-0 right-0 m-4 px-3 py-2 w-[70%] bg-black/40 text-white/70 font-semibold rounded-[0.75rem]"
        onClick={() => {}}
      >
        start transfer
      </button>
    </>
  );
};

export default PlaylistDetail;
