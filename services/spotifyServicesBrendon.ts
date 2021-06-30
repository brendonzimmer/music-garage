import { GroupedPlaylistData, PlaylistData, tokenData } from "./spotifyServices";
import axios from "axios";
import btoa from "btoa";

// for services about Brendon
const clientId = process.env.SPOTIFY_GARAGEMUSIC_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_GARAGEMUSIC_CLIENT_SECRET;

export function getToken() {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  };

  return axios.post<tokenData>("https://accounts.spotify.com/api/token", "grant_type=client_credentials", { headers });
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

  return axios.get<PlaylistData>(`https://api.spotify.com/v1/playlists/${id}?`, {
    headers: headers,
  });
}

export function getPlaylistTracks(id: string, token: tokenData["access_token"], offset: number) {
  const headers = {
    Authorization: "Bearer " + token,
  };

  return axios.get<PlaylistData["tracks"]>(`https://api.spotify.com/v1/playlists/${id}/tracks?offset=${offset}`, {
    headers: headers,
  });
}
