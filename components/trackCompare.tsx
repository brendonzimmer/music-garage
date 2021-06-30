import { useState } from "react";
import { TrackData } from "../services/spotifyServices";
import Track from "./track";

const TrackCompare: React.FC<{ tracks: TrackData[] }> = ({ tracks: t }) => {
  const [tracks, setTracks] = useState(t);
  const [compare, setCompare] = useState<TrackData>();

  return (
    <>
      <div>
        <Track track={tracks[0]} />
      </div>
      {compare ? (
        <div>
          <Track track={compare} />
        </div>
      ) : (
        <div>Loading Apple Music search results...</div>
      )}
    </>
  );
};

export default TrackCompare;
