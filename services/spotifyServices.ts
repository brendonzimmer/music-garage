import axios from "axios";
import btoa from "btoa";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

export function getToken<T>() {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  };

  return axios.post<T>("https://accounts.spotify.com/api/token", "grant_type=client_credentials", { headers: headers });
}

export function getAllPlaylists(token: tokenData["access_token"]) {
  const headers = {
    Authorization: "Bearer " + token,
  };

  return axios.get<GroupedPlaylistData>(`https://api.spotify.com/v1/users/brendonzimmer/playlists?&limit=50`, {
    headers: headers,
  });
}

export function getPlaylist(id: string, token: tokenData["access_token"]) {
  const headers = {
    Authorization: "Bearer " + token,
  };

  return axios.get<PlaylistData>(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: headers,
  });
}

export function getPlaylistTracks(id: string) {
  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  return axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: headers,
  });
}

export interface tokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
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
