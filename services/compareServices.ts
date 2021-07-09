import { TrackData } from "./spotifyServices";
import axios from "axios";

// Search for song
export async function searchSong(musicKit: MusicKit.MusicKitInstance, track: TrackData, offset?: number) {
  const res = (await musicKit.api.search(track.track.name + " " + track.track.artists[0].name, {
    types: "songs",
    offset,
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

export async function createPlaylist(devToken: string, musicUserToken: string, name: string) {
  const res = await axios.post<playlistCreateResponse>(
    "https://api.music.apple.com/v1/me/library/playlists?l=en",
    {
      attributes: {
        name,
        description: "Thank you for using my website! <3",
      },
    },
    { headers: { authorization: `Bearer ${devToken}`, "music-user-token": musicUserToken } }
  );

  return res.data.data[0].id;
}

export async function confirmMatch(
  playlistId: string,
  devToken: string,
  musicUserToken: string,
  match: songSearchResponse["data"][0]
) {
  const res = await axios.post(
    `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks?l=en`,
    {
      data: [
        {
          id: match.id,
          type: "songs",
        },
      ],
    },
    { headers: { authorization: `Bearer ${devToken}`, "music-user-token": musicUserToken } }
  );

  return;
}

export async function testSongPair(
  playlistId: string,
  devToken: string,
  musicUserToken: string,
  match: songSearchResponse["data"][0],
  track: TrackData
) {
  if (
    track.track.name.toLowerCase() === match.attributes.name.toLowerCase() &&
    track.track.artists[0].name.toLowerCase() === match.attributes.artistName.toLowerCase()
  ) {
    await confirmMatch(playlistId, devToken, musicUserToken, match);
    return false;
  }

  return true;
}

export interface playlistCreateResponse {
  data: {
    id: string;
    type: "library-playlists";
    href: string;
    attributes: {
      name: string;
      description: {
        standard: string;
      };
      playParams: {
        id: string;
        kind: "playlist";
        isLibrary: true;
      };
      canEdit: true;
    };
  }[];
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
