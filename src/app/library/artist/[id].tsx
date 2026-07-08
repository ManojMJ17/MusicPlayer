import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { libraryService } from '@/services/library.service';

import { Artist, Song } from '@/types/music';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ArtistScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { play } = usePlayer();

    const [artist, setArtist] = useState<Artist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadArtist() {
            try {
                const [artistData, artistSongs] = await Promise.all([
                    libraryService.getArtist(id),
                    libraryService.getArtistSongs(id),
                ]);

                setArtist(artistData);
                setSongs(artistSongs);
            } catch {
                setError('Failed to load artist');
            } finally {
                setLoading(false);
            }
        }

        loadArtist();
    }, [id]);

    const handleSongPress = async (song: Song) => {
        await play(song, songs);
    };

    if (!artist && !loading) {
        return (
            <EmptyState
                icon="mic"
                title="Artist not found"
                description="This artist could not be loaded."
            />
        );
    }

    return (
        <PageLayout
            title={artist?.name ?? 'Artist'}
            subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'
                }`}
        >
            <DataState
                loading={loading}
                error={error}
                isEmpty={songs.length === 0}
                empty={
                    <EmptyState
                        icon="mic"
                        title="No songs"
                        description="This artist has no songs."
                    />
                }
            >
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        artist && (
                            <View style={styles.header}>
                                <View style={styles.avatar}>
                                    <MaterialIcons
                                        name="mic"
                                        size={60}
                                        color={Colors.dark.primary}
                                    />
                                </View>

                                <AppText style={styles.title}>
                                    {artist.name}
                                </AppText>

                                <AppText
                                    variant="body"
                                    color={Colors.dark.textSecondary}
                                >
                                    {artist.albumCount} Albums • {artist.songCount} Songs
                                </AppText>

                                <AppText
                                    variant="caption"
                                    color={Colors.dark.textSecondary}
                                >
                                    {artist.name} • {artist.albumCount} albums  {artist.songCount} songs
                                </AppText>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <SongCard
                            song={item}
                            onPress={handleSongPress}
                        />
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                />
            </DataState>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: Theme.spacing['2xl'],
    },

    title: {
        marginTop: Theme.spacing.lg,
    },

    separator: {
        height: Theme.spacing.md,
    },

    content: {
        paddingBottom: Theme.spacing['4xl'],
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,

        backgroundColor: Colors.dark.surfaceVariant,
        borderWidth: 1,
        borderColor: Colors.dark.border,

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: Theme.spacing.lg,
    },
});