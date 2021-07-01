import { artworkURL, searchSong, songSearchResponse } from "../services/compareServices";
import { TransferContext, TransferProps } from "./context/TransferContext";
import { TrackData } from "../services/spotifyServices";
import { useContext, useEffect, useState } from "react";
import Track from "./track";

const TrackCompare: React.FC<{ tracks: TrackData[] }> = ({ tracks: t }) => {
  const { musicKit, musicUserToken } = useContext<TransferProps>(TransferContext);
  const [compare, setCompare] = useState<songSearchResponse>();
  const [track, setTrack] = useState(t[0]);

  useEffect(() => {
    async function run() {
      setCompare(await searchSong(musicKit, track));
    }
    if (musicKit && track) return run() as any;
  }, [track]);

  return (
    <div className="space-y-2">
      <div>
        <Track track={track} />
      </div>
      {compare ? (
        <div>
          <div className="flex bg-white bg-opacity-20 rounded-md items-center shadow">
            {compare.data[0].attributes.artwork.url ? (
              <img
                src={artworkURL(
                  compare.data[0].attributes.artwork,
                  track.track.album.images[0].width,
                  track.track.album.images[0].height
                )}
                alt={`${compare.data[0].attributes.name} by ${compare.data[0].attributes.artistName} Album Cover`}
                className="w-[17.5%] min-w-[60px] rounded-l"
              />
            ) : (
              <></> // <BanIcon className="w-[17.5%] min-w-[60px] text-black opacity-60" />
            )}
            <div className="text-black text-opacity-60 ml-2">
              <div className="text-sm font-medium line-clamp-1">{compare.data[0].attributes.name}</div>
              <div className="text-xs line-clamp-1">{compare.data[0].attributes.artistName}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading Apple Music search results...</div>
      )}
    </div>
  );
};

export default TrackCompare;
