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
  const [searchOffset, setSearchOffset] = useState(5);
  const [moreResults, setMoreResults] = useState(true);
  const [automatic, setAutomatic] = useState(false);
  const [finished, setFinished] = useState(false);
  const [neverFound] = useState<TrackData[]>([]);
  const [exile] = useState<number[]>([]);
  const [chosen, setChosen] = useState(0);
  const [track, setTrack] = useState(t[0]);
  const [index, setIndex] = useState(0);

  useRouterCaution();

  async function autoMode() {
    await new Promise((resolve, reject) => {
      searchSong(musicKit, t[index])
        .then(s => {
          setCompare(s);
          testSongPair(playlistId, devToken, musicUserToken, s.data[0], t[index]).then(bool => {
            bool ? exile.push(index) : null;
            setIndex(prev => prev + 1);
            resolve(bool);
          });
        })
        .catch(() => {
          neverFound.push(t[index]);
          setIndex(prev => prev + 1);
        });
    });
  }

  useEffect(() => {
    async function run() {
      if (!automatic) {
        searchSong(musicKit, track).then(s => {
          setCompare(s);
        });
      }
    }
    if (musicKit && track) run() as any;
    if (automatic) autoMode(); // need to chnage if statements
  }, [track]);

  useEffect(() => {
    if (finished && index >= exile.length) return setEndScreen(true);
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
      <div className="space-y-2 lg:col-span-3 xl:col-span-5 3xl:col-span-6 xs:max-w-[calc(30rem-1.5rem)] md:max-w-[calc(38rem-1.5rem)] lg:max-w-full lg:min-w-full">
        {finished && <h1 className="place-self-start font-medium text-black/70 text-2xl">Unable to find...</h1>}
        <button
          hidden={finished}
          className="px-3 py-2 bg-black/50 text-white/75 font-medium rounded-md w-full"
          onClick={() => setAutomatic(prev => !prev)}
        >
          click to{automatic ? " pause automatic mode" : " run automatically"}
        </button>
        <div className="bg-white/20 rounded-md shadow-sm px-2 pb-2">
          <h1 className="font-medium text-black/60 text-xl py-1">Spotify</h1>
          <Track track={track} />
        </div>
        {compare ? (
          <div className="bg-white/20 rounded-md shadow-sm px-2 pb-2">
            <h1 className="font-medium text-black/60 text-xl py-1">Apple Music</h1>
            <div
              className={
                "flex bg-white bg-opacity-20 rounded-md items-center shadow" +
                (viewSearch ? " cursor-pointer hover:bg-black/10 duration-100" : "")
              }
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

            <div className={"space-y-1.5 mt-1.5" + (viewSearch ? " cursor-pointer" : " hidden")}>
              {compare.data.map((s, index) =>
                index !== chosen ? (
                  <div
                    key={s.id}
                    onClick={() => {
                      setChosen(index);
                      setViewSearch(false);
                    }}
                    className="flex bg-white bg-opacity-20 rounded-md items-center shadow hover:bg-black/10 duration-100"
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

            <div className={"mt-2 grid gap-2" + (viewSearch ? " lg:grid-cols-3" : " lg:grid-cols-2")}>
              <button
                className="px-3 py-2 bg-green-600/60 disabled:opacity-60 rounded-md text-white/70"
                onClick={() => {
                  setIndex(prev => prev + 1);
                  confirmMatch(playlistId, devToken, musicUserToken, compare.data[chosen]);
                  setChosen(0);
                  setSearchOffset(5);
                  setViewSearch(false);
                }}
                disabled={automatic || viewSearch}
              >
                correct
              </button>
              <button
                className="px-3 py-2 bg-yellow-500/60 disabled:opacity-60 rounded-md text-white/70"
                onClick={() => {
                  async function run() {
                    if (viewSearch) {
                      const res = await searchSong(musicKit, track, searchOffset);
                      if (res?.data.length < 5 || !res) setMoreResults(false);

                      setSearchOffset(searchOffset + 5);
                      setCompare(prev => {
                        if (res) prev.data.push(...res.data);
                        return prev;
                      });
                    }
                    setViewSearch(true);
                  }
                  run();
                }}
                disabled={automatic || !moreResults || (compare.data.length < 5 && viewSearch)}
              >
                more results
              </button>
              <button
                hidden={!viewSearch}
                className="px-3 py-2 bg-red-500/60 disabled:opacity-60 rounded-md text-white/70"
                onClick={() => {
                  setViewSearch(false);
                  if (finished) neverFound.push(t[exile[index]]);
                  if (!finished) exile.push(index);
                  console.log("Cannot find songs ", neverFound);
                  setChosen(0);
                  setIndex(prev => prev + 1);
                }}
                disabled={automatic}
              >
                not found
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
