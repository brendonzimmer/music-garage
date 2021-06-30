import { TrackData } from "../services/spotifyServices";
import { BanIcon } from "@heroicons/react/solid";

const Track: React.FC<{ track: TrackData }> = ({ track: t }) => {
  function artists(song: TrackData, max?: number) {
    let artist = song.track.artists[0].name;

    for (let a = 1; a < song.track.artists.length; a++) {
      artist += ", " + song.track.artists[a].name;

      if (a === max - 1) break;
    }

    return artist;
  }

  return (
    <div key={t.track.id} className="flex bg-white bg-opacity-20 rounded-md items-center shadow">
      {t.track.album.images[0] ? (
        <img
          src={t.track.album.images[0].url}
          alt={`${t.track.name} by ${t.track.artists[0].name} Album Cover`}
          className="w-[17.5%] min-w-[60px] rounded-l"
        />
      ) : (
        <BanIcon className="w-[17.5%] min-w-[60px] text-black opacity-60" />
      )}
      <div className="text-black text-opacity-60 ml-2 overflow-hidden whitespace-nowrap">
        <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
          {t.track.name[40] ? t.track.name.substring(0, 40) + "..." : t.track.name}
        </div>
        <div className="text-xs overflow-hidden overflow-ellipsis">
          {artists(t)[50] ? artists(t).substring(0, 50) + "..." : artists(t)}
        </div>
      </div>
    </div>
  );
};

export default Track;
