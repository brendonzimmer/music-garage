import { TrackData } from "./spotifyServices";

// Search for song
export async function searchSong(musicKit: MusicKit.MusicKitInstance, track: TrackData) {
  const res = (await musicKit.api.search(track.track.name + " " + track.track.artists[0].name, {
    types: "songs",
  })) as any;

  const songs = res.songs as songSearchResponse;

  return songs;
}

export function artworkURL(
  artwork: songSearchResponse["data"][0]["attributes"]["artwork"],
  width?: number,
  height?: number
) {
  const url =
    artwork.url.split("{w}x{h}")[0] +
    (width || artwork.width) +
    "x" +
    (height || artwork.height) +
    artwork.url.split("{w}x{h}")[1];
  return url;
}

export interface songSearchResponse {
  href: string;
  next: string;
  data: {
    id: string | number;
    type: "songs";
    href: string;
    attributes: {
      previews: {
        url: string;
      }[];
      artwork: {
        width: number;
        height: number;
        url: string;
        bgColor: string;
        textColor1: string;
        textColor2: string;
        textColor3: string;
        textColor4: string;
      };
      artistName: string;
      url: string;
      discNumber: 1;
      genreNames: string[];
      durationInMillis: number;
      releaseDate: string;
      name: string;
      isrc: string;
      hasLyrics: boolean;
      albumName: string;
      playParams: {
        id: string | number;
        kind: "song";
      };
      trackNumber: number;
      composerName: string;
    };
  }[];
}
