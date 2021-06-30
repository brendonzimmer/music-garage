import { setCookie } from "./cookieServices";
import axios from "axios";
import btoa from "btoa";
import { GetServerSidePropsContext } from "next";

// for services about Transfering
const clientId = process.env.SPOTIFY_MOVING_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_MOVING_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/transfer/playlists";

// Only use on server!
async function getToken(authCode: userTokenData["access_token"]) {
  const headers = {
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  };

  // Send request for token using auth code and extract to const result
  const { data: result } = await axios.post<userTokenData>("https://accounts.spotify.com/api/token", null, {
    headers,
    params: { grant_type: "authorization_code", code: authCode, redirect_uri },
  });

  return result;
}

// Only use on server!
async function refreshToken(refreshToken: userTokenData["refresh_token"]) {
  const headers = {
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  };

  // Send request for token using refresh token and extract to const result
  const { data: result } = await axios.post<userTokenData>("https://accounts.spotify.com/api/token", null, {
    headers,
    params: { grant_type: "refresh_token", refresh_token: refreshToken },
  });

  return result;
}

// Only use on server. Can refresh token. Must have Auth code in query or Refresh token in cookie.
export async function getUserToken(context: GetServerSidePropsContext): Promise<userTokenData["access_token"]> {
  if (context.req.cookies.refresh) {
    const newToken = await refreshToken(context.req.cookies.refresh);
    return newToken.access_token;
  }

  // if request is callback from spotify
  if (context.query.code) {
    const token = await getToken(context.query.code as string);

    setCookie(context.res, token.refresh_token);
    return token.access_token;
  }

  return undefined;
}

// Uses recursion to get all playlists
export async function getAllPlaylists(token: userTokenData["access_token"], next?: string) {
  const playlists: GroupedPlaylistData["items"] = [];

  const headers = {
    Authorization: "Bearer " + token,
  };

  const { data: results } = await axios.get<GroupedPlaylistData>(
    next || `https://api.spotify.com/v1/me/playlists?limit=50`,
    { headers }
  );

  playlists.push(...results.items);

  if (results.next) playlists.push(...(await getAllPlaylists(token, results.next as string)));

  return playlists;
}

export async function getPlaylist(id: string, token: userTokenData["access_token"]) {
  const headers = {
    Authorization: "Bearer " + token,
  };

  const { data: res } = await axios.get<PlaylistData>(`https://api.spotify.com/v1/playlists/${id}`, { headers });

  return res;
}

// Uses recursion to get all songs
export async function getPlaylistTracks(id: string, token: tokenData["access_token"], next?: string) {
  const tracks: TrackData[] = [];

  const headers = {
    Authorization: "Bearer " + token,
  };

  const { data: results } = await axios.get<PlaylistData["tracks"]>(
    `https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`,
    { headers }
  );

  tracks.push(...results.items);

  if (results.next) tracks.push(...(await getPlaylistTracks(id, token, results.next as string)));

  return tracks;
}

export interface tokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface userTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface GroupedPlaylistData {
  href: string;
  items: {
    collaborative: boolean;
    description: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    name: string;
    owner: {
      display_name: string;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      type: string;
      uri: string;
    };
    primary_color: unknown;
    public: boolean;
    snapshot_id: string;
    tracks: {
      href: string;
      total: number;
    };
    type: string;
    uri: string;
  }[];
  limit: number;
  next: unknown;
  offset: number;
  previous: unknown;
  total: number;
}

export interface PlaylistData {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  followers: { href: unknown; total: number };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: unknown;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    items: TrackData[];
    limit: number;
    next: unknown;
    offset: number;
    previous: unknown;
    total: number;
  };
  type: string;
  uri: string;
}

export interface TrackData {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: unknown;
  track: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: [
      {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }
    ];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
  };
  video_thumbnail: {
    url: unknown;
  };
}
