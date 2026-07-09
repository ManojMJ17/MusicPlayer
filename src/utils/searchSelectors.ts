import { Album, Artist, Song } from '@/types/music';

export const songSearchFields = (song: Song) => [
  song.title,
  song.artist,
  song.album,
];

export const albumSearchFields = (album: Album) => [album.title, album.artist];

export const artistSearchFields = (artist: Artist) => [artist.name];
