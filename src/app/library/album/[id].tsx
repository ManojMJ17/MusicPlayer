import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { AlbumArtwork } from '@/components/music/AlbumArtwork';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { libraryService } from '@/services/library.service';

import { Album, Song } from '@/types/music';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

export default function AlbumScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // if (typeof id !== "string") {
    //     return null;
    // }

    const { play } = usePlayer();

    const [album, setAlbum] = useState<Album | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        if (!id) return;
        async function loadAlbum() {
            try {
                const [albumData, albumSongs] = await Promise.all([
                    libraryService.getAlbum(id),
                    libraryService.getAlbumSongs(id),
                ]);

                setAlbum(albumData);
                setSongs(albumSongs);
            } catch {
                setError('Failed to load album');
            } finally {
                setLoading(false);
            }
        }

        loadAlbum();
    }, [id]);

    const handleSongPress = async (song: Song) => {
        await play(song, songs);
    };

    if (!album && !loading) {
        return (
            <EmptyState
                icon="album"
                title="Album not found"
                description="This album could not be loaded."
            />
        );
    }

    return (
        <PageLayout
            title={album?.title ?? 'Album'}
            subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'
                }`}
        >
            <DataState
                loading={loading}
                error={error}
                isEmpty={songs.length === 0}
                empty={
                    <EmptyState
                        icon="album"
                        title="No songs"
                        description="This album has no songs."
                    />
                }
            >
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        album && (
                            <View style={styles.header}>
                                <AlbumArtwork
                                    uri={album.artwork}
                                    title={album.title}
                                    size="xl"
                                />

                                <AppText style={styles.title}>
                                    {album.title}
                                </AppText>

                                <AppText
                                    variant="body"
                                    color={Colors.dark.textSecondary}
                                >
                                    {album.artist}
                                </AppText>

                                <AppText
                                    variant="caption"
                                    color={Colors.dark.textSecondary}
                                >
                                    {album.year ?? 'Unknown Year'} • {album.songCount} songs
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
});