import { artworkURL, confirmMatch, searchSong, songSearchResponse, testSongPair } from "../services/compareServices";
import { TransferContext, TransferProps } from "./context/TransferContext";
import { useRouterCaution } from "./hooks/useRouterCaution";
import { TrackData } from "../services/spotifyServices";
import { useContext, useEffect, useState } from "react";
import Track from "./track";

const TrackCompare: React.FC<{ tracks: TrackData[]; devToken: string; playlistId: string; setEndScreen: any }> = ({
  tracks: t,
  devToken,
  playlistId,
  setEndScreen,
}) => {
  const { musicKit, musicUserToken } = useContext<TransferProps>(TransferContext);
  const [compare, setCompare] = useState<songSearchResponse>();
  const [viewSearch, setViewSearch] = useState(false);
  const [automatic, setAutomatic] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exile] = useState<number[]>([]);
  const [chosen, setChosen] = useState(0);
  const [track, setTrack] = useState(t[0]);
  const [index, setIndex] = useState(0);

  useRouterCaution();

  async function autoMode() {
    await new Promise((resolve, reject) => {
      searchSong(musicKit, t[index]).then(s => {
        testSongPair(playlistId, devToken, musicUserToken, s.data[0], t[index]).then(bool => {
          bool ? exile.push(index) : null;
          resolve(bool);
        });
      });
    });
    setIndex(prev => prev + 1);
  }

  useEffect(() => {
    async function run() {
      setCompare(await searchSong(musicKit, track));
    }
    if (musicKit && track) run() as any;
    if (automatic) autoMode();
  }, [track]);

  useEffect(() => {
    if (index >= exile.length) return setEndScreen(true);
    if (finished && exile[0]) return setTrack(t[exile[index]]);
    if (index > 0 && index < t.length) setTrack(t[index]);
    if (index >= t.length) {
      setAutomatic(false);
      setFinished(true);
    }
  }, [index]);

  useEffect(() => {
    if (automatic) {
      autoMode();
    }
  }, [automatic]);

  useEffect(() => {
    if (finished) {
      setAutomatic(false);
      setViewSearch(false);
      setCompare(undefined);
      setIndex(0);
    }
  }, [finished]);

  return (
    <>
      {finished && <h1 className="place-self-start font-medium text-black/70 text-2xl">Unable to find...</h1>}
      <div className="space-y-2">
        <button
          hidden={finished}
          className="px-3 py-2 bg-white/30 text-black/60 font-medium rounded-md"
          onClick={() => setAutomatic(prev => !prev)}
        >
          Automatic Mode{automatic ? ": On" : ": Off"}
        </button>
        <div className="bg-white/20 rounded-md shadow-sm px-2 pb-2">
          <h1 className="font-medium text-black/60 text-xl py-1">Spotify</h1>
          <Track track={track} />
        </div>
        {compare ? (
          <div className="bg-white/20 rounded-md shadow-sm px-2 pb-2">
            <h1 className="font-medium text-black/60 text-xl py-1">Apple Music</h1>
            <div
              className="flex bg-white bg-opacity-20 rounded-md items-center shadow"
              onClick={() => setViewSearch(false)}
            >
              {compare.data[chosen].attributes.artwork.url ? (
                <img
                  src={artworkURL(
                    compare.data[chosen].attributes.artwork,
                    track?.track.album.images[0].width,
                    track?.track.album.images[0].height
                  )}
                  alt={`${compare.data[chosen].attributes.name} by ${compare.data[chosen].attributes.artistName} Album Cover`}
                  className="w-[17.5%] min-w-[60px] rounded-l"
                />
              ) : (
                <></> // <BanIcon className="w-[17.5%] min-w-[60px] text-black opacity-60" />
              )}
              <div className="text-black text-opacity-60 ml-2">
                <div className="text-sm font-medium line-clamp-1">{compare.data[chosen].attributes.name}</div>
                <div className="text-xs line-clamp-1">{compare.data[chosen].attributes.artistName}</div>
              </div>
            </div>

            <div className={"space-y-1.5 mt-1.5" + (viewSearch ? "" : " hidden")}>
              {compare.data.map((s, index) =>
                index !== chosen ? (
                  <div
                    key={s.id}
                    onClick={() => {
                      setChosen(index);
                      setViewSearch(false);
                    }}
                    className="flex bg-white bg-opacity-20 rounded-md items-center shadow"
                  >
                    {s.attributes.artwork.url ? (
                      <img
                        src={artworkURL(
                          s.attributes.artwork,
                          track.track.album.images[0].width,
                          track.track.album.images[0].height
                        )}
                        alt={`${s.attributes.name} by ${s.attributes.artistName} Album Cover`}
                        className="w-[17.5%] min-w-[60px] rounded-l"
                      />
                    ) : (
                      <></> // <BanIcon className="w-[17.5%] min-w-[60px] text-black opacity-60" />
                    )}
                    <div className="text-black text-opacity-60 ml-2">
                      <div className="text-sm font-medium line-clamp-1">{s.attributes.name}</div>
                      <div className="text-xs line-clamp-1">{s.attributes.artistName}</div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                className="px-3 py-2 bg-green-600/60 disabled:opacity-60 rounded-md text-white/70"
                onClick={() => {
                  setIndex(prev => prev + 1);
                  confirmMatch(playlistId, devToken, musicUserToken, compare.data[chosen]);
                }}
                disabled={automatic}
              >
                correct
              </button>
              <button
                className="px-3 py-2 bg-yellow-500/60 disabled:opacity-60 rounded-md text-white/70"
                onClick={() => {
                  async function run() {
                    if (viewSearch) {
                      const res = await searchSong(musicKit, track, 5);

                      setCompare(prev => (res ? res : prev));
                    }
                    setViewSearch(true);
                  }
                  run();
                }}
                disabled={automatic}
              >
                more results
              </button>
            </div>
          </div>
        ) : (
          <div>Loading Apple Music search results...</div>
        )}
      </div>
    </>
  );
};

export default TrackCompare;
