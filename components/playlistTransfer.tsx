import { MusicNoteIcon, ExternalLinkIcon, ArrowSmLeftIcon } from "@heroicons/react/solid";
import { GroupedPlaylistData, TrackData } from "../services/spotifyServices";
import { TransferContext, TransferProps } from "./context/TransferContext";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { createPlaylist } from "../services/compareServices";
import TrackCompare from "./trackCompare";
import ThankYou from "./thankYou";
import { useState } from "react";
import Track from "./track";

const PlaylistTransfer: React.FC<{
  playlist: GroupedPlaylistData["items"][0];
  tracks: TrackData[];
  backButton: [Dispatch<SetStateAction<GroupedPlaylistData["items"][0]>>, Dispatch<SetStateAction<TrackData[]>>];
  devToken: string;
}> = ({ playlist, tracks, backButton, devToken }) => {
  const { musicUserToken } = useContext<TransferProps>(TransferContext);
  const [name, setName] = useState(playlist?.name);
  const [desc, setDesc] = useState(playlist?.description);
  const [transferStarted, setTransferStarted] = useState(false);
  const [playlistId, setPlaylistId] = useState<string>();
  const [endScreen, setEndScreen] = useState(false);

  useEffect(() => {
    const parser = new DOMParser();
    setName(parser.parseFromString(`<!doctype html><body>${playlist?.name || ""}`, "text/html").body.textContent);
    setDesc(
      parser.parseFromString(`<!doctype html><body>${playlist?.description || ""}`, "text/html").body.textContent
    );
  }, [playlist]);

  useEffect(() => {
    async function run() {
      if (transferStarted) return setPlaylistId(await createPlaylist(devToken, musicUserToken, name));
    }

    run();
  }, [transferStarted]);

  const HEADER_INFO_UNDER_MD = (
    <div className="flex text-sm lg:hidden">
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
  );

  const HEADER_INFO_MD_ABOVE = (
    <div className="hidden lg:grid place-items-center gap-3 grid-cols-3 text-sm leading-none font-semibold text-black/40 text-center">
      <div className="flex items-center justify-center h-full bg-white/20 rounded-md shadow px-3 py-2 w-full">
        <MusicNoteIcon className="w-4 h-4 m-1" />
        {playlist.tracks.total} songs
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

  return !endScreen ? (
    <>
      {/* Display Playlist */}
      <div className="m-3 grid place-items-center lg:grid-cols-5 lg:gap-3 xl:grid-cols-9">
        {/* Title & Image */}
        <div className="xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:max-w-full lg:sticky lg:top-3 lg:col-span-2 lg:place-self-start xl:col-span-3 2xl:col-span-2">
          <div className="p-2 bg-white bg-opacity-20 rounded-md shadow-sm">
            <div className="grid grid-cols-6 items-start text-[1.75rem] leading-none font-semibold text-black/40 space-x-2">
              <img
                src={playlist?.images[0].url}
                alt="Playlist Cover Image"
                className="rounded-lg shadow-sm col-span-2"
              />
              <div className="flex flex-col col-span-4 items-center my-auto space-y-2">
                <div className="line-clamp-2 text-center">{name}</div>
                {HEADER_INFO_UNDER_MD}
              </div>
            </div>
          </div>

          {/* Back Button 1 */}
          <div className="hidden lg:grid gap-2 grid-cols-5 justify-center mt-2 w-full text-white/80 font-semibold xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:max-w-full">
            <button
              className="px-3 py-2 col-span-4 bg-black/50 rounded-md"
              onClick={() => setTransferStarted(prev => !prev)}
            >
              {transferStarted ? "stop transfer" : "start transfer"}
            </button>
            <button
              className="col-span-1 px-3 py-2 bg-black/50 rounded-md flex justify-center disabled:opacity-60 duration-300 ease-in-out"
              disabled={transferStarted}
              onClick={() => {
                backButton[0](undefined);
                backButton[1](undefined);
              }}
            >
              <ArrowSmLeftIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden mt-2 lg:grid w-full justify-start">{HEADER_INFO_MD_ABOVE}</div>

          {/* Description */}
          <div className="text-white/70 text-[0.90rem] leading-[1.1rem] pb-0.5 font-medium my-1 line-clamp-1 md:line-clamp-2 lg:line-clamp-none lg:pr-1">
            {desc}
          </div>
        </div>

        {/* Back Button 2 */}
        <div className="sticky grid gap-2 grid-cols-10 justify-center top-3 mb-2 w-full text-white/80 font-semibold xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:hidden">
          <button
            className="col-span-3 px-3 py-2 bg-black/50 rounded-md flex justify-center disabled:opacity-60 duration-300 ease-in-out"
            disabled={transferStarted}
            onClick={() => {
              backButton[0](undefined);
              backButton[1](undefined);
            }}
          >
            <ArrowSmLeftIcon className="w-6 h-6" />
          </button>
          <button
            className="px-3 py-2 col-span-7 bg-black/50 rounded-md"
            onClick={() => setTransferStarted(prev => !prev)}
          >
            {transferStarted ? "stop transfer" : "start transfer"}
          </button>
        </div>

        {transferStarted && playlistId ? (
          <TrackCompare tracks={tracks} devToken={devToken} playlistId={playlistId} setEndScreen={setEndScreen} />
        ) : (
          <div className="grid grid-cols-1 gap-2 xs:max-w-[calc(30rem-1.5rem)] md:grid-cols-2 md:max-w-[calc(38rem-1.5rem)] lg:max-w-full lg:col-span-3 xl:col-span-6 2xl:col-span-7 2xl:grid-cols-3 3xl:grid-cols-4">
            {tracks.map(t => (
              <Track key={t.track.id} track={t} />
            ))}
          </div>
        )}
      </div>
    </>
  ) : (
    <ThankYou />
  );
};

export default PlaylistTransfer;
