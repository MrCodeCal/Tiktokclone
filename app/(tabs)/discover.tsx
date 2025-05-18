import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { mockVideos } from '@/mocks/data';
import { formatNumber } from '@/utils/formatters';

const categories = [
  'Trending', 'Comedy', 'Dance', 'Food', 'Travel', 'Sports', 'Beauty', 'Fashion', 'Music', 'Pets'
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      // Filter videos by username or description
      const results = mockVideos.filter(video => 
        video.user.username.toLowerCase().includes(text.toLowerCase()) ||
        video.description.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
  };

  const handleVideoPress = (videoId: string) => {
    router.push({
      pathname: '/(tabs)',
      params: { videoId }
    });
  };

  const handleUserPress = (userId: string) => {
    router.push({
      pathname: `/user/${userId}`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isSearchActive ? (
          <View style={styles.searchBarActive}>
            <Search size={20} color={Colors.dark.subtext} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search videos, users, or hashtags"
              placeholderTextColor={Colors.dark.subtext}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color={Colors.dark.subtext} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => setIsSearchActive(true)}
          >
            <Search size={20} color={Colors.dark.subtext} />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isSearchActive && searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.searchResultItem}
              onPress={() => handleVideoPress(item.id)}
            >
              <Image 
                source={{ uri: item.user.avatar }} 
                style={styles.searchResultAvatar}
              />
              <View style={styles.searchResultContent}>
                <TouchableOpacity onPress={() => handleUserPress(item.userId)}>
                  <Text style={styles.searchResultUsername}>@{item.user.username}</Text>
                </TouchableOpacity>
                <Text style={styles.searchResultDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Image 
                source={{ uri: item.videoUrl.replace('.mp4', '.jpg') || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' }} 
                style={styles.searchResultThumbnail}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchText}>No results found for "{searchQuery}"</Text>
            </View>
          }
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <FlatList
              data={mockVideos.slice(0, 4)}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.trendingItem}
                  onPress={() => handleVideoPress(item.id)}
                >
                  <Image 
                    source={{ uri: item.videoUrl.replace('.mp4', '.jpg') || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' }} 
                    style={styles.trendingImage}
                    contentFit="cover"
                  />
                  <View style={styles.trendingOverlay}>
                    <Text style={styles.trendingViews}>{formatNumber(item.likes * 2)} views</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingList}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Creators</Text>
            <FlatList
              data={mockVideos.map(video => video.user)}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.creatorItem}
                  onPress={() => handleUserPress(item.id)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
                  <Text style={styles.creatorName}>@{item.username}</Text>
                  <Text style={styles.creatorFollowers}>{formatNumber(item.followers)} followers</Text>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.creatorsList}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discover Videos</Text>
            <View style={styles.videoGrid}>
              {mockVideos.map((video) => (
                <TouchableOpacity 
                  key={video.id} 
                  style={styles.videoItem}
                  onPress={() => handleVideoPress(video.id)}
                >
                  <Image 
                    source={{ uri: video.videoUrl.replace('.mp4', '.jpg') || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' }} 
                    style={styles.videoThumbnail}
                    contentFit="cover"
                  />
                  <View style={styles.videoOverlay}>
                    <Text style={styles.videoViews}>{formatNumber(video.likes * 2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBarActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    marginLeft: 10,
    fontSize: 16,
  },
  searchPlaceholder: {
    color: Colors.dark.subtext,
    marginLeft: 10,
    fontSize: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    alignItems: 'center',
  },
  searchResultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultUsername: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchResultDescription: {
    color: Colors.dark.subtext,
  },
  searchResultThumbnail: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginLeft: 10,
  },
  emptySearch: {
    padding: 20,
    alignItems: 'center',
  },
  emptySearchText: {
    color: Colors.dark.subtext,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
  trendingList: {
    paddingLeft: 15,
  },
  trendingItem: {
    width: 250,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  trendingViews: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  creatorsList: {
    paddingLeft: 15,
  },
  creatorItem: {
    width: 120,
    alignItems: 'center',
    marginRight: 15,
  },
  creatorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  creatorName: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  creatorFollowers: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  followButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  followText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  videoItem: {
    width: '33.33%',
    aspectRatio: 0.8,
    padding: 5,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  videoViews: {
    color: Colors.dark.text,
    fontSize: 12,
  },
});