import { GroupedPlaylistData } from "../services/spotifyServices";
import { MusicNoteIcon } from "@heroicons/react/solid";

const PlaylistCover: React.FC<{ playlist: GroupedPlaylistData["items"][0] }> = ({ playlist: p }) => {
  return (
    <div className="p-1.5 bg-white bg-opacity-20 rounded-md shadow-sm hover:cursor-pointer hover:bg-opacity-[0.25] active:bg-opacity-[0.35] duration-100">
      <img src={p.images[0].url} alt={`${p.name} Playlist Cover Image`} className="rounded-lg shadow-sm" />
      <div className="flex justify-between items-end mx-0.5">
        <div className="mt-0.5 -mb-0.5 font-medium text-black text-opacity-40 line-clamp-1">{p.name}</div>
        <div className="text-xs font-medium text-black text-opacity-40 flex items-center md:text-sm">
          {p.tracks.total}
          <MusicNoteIcon className="w-3 h-3 mx-0.5 md:w-3.5 md:h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default PlaylistCover;
