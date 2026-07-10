import {
  Music,
  Heart,
  Star,
  Disc,
  Headphones,
  Guitar,
  Mic,
  Radio,
  Folder,
  BookMarked,
  Flame,
  Moon,
  Dumbbell,
  Coffee,
  PartyPopper,
  LucideIcon
} from 'lucide-react-native';

export interface PlaylistIconInfo {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const PLAYLIST_ICONS: PlaylistIconInfo[] = [
  { id: 'music', label: 'Music', icon: Music },
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'disc', label: 'Disc', icon: Disc },
  { id: 'headphones', label: 'Headphones', icon: Headphones },
  { id: 'guitar', label: 'Guitar', icon: Guitar },
  { id: 'mic', label: 'Mic', icon: Mic },
  { id: 'radio', label: 'Radio', icon: Radio },
  { id: 'folder', label: 'Folder', icon: Folder },
  { id: 'bookmark', label: 'Bookmark', icon: BookMarked },
  { id: 'fire', label: 'Fire', icon: Flame },
  { id: 'moon', label: 'Moon', icon: Moon },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'party', label: 'Party', icon: PartyPopper },
];

export function getPlaylistIcon(id?: string | null): LucideIcon {
  if (!id) return Music;
  const found = PLAYLIST_ICONS.find((item) => item.id === id);
  return found ? found.icon : Music;
}
