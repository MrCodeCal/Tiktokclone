import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Grid, Bookmark, Lock } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoStore } from '@/stores/videoStore';
import { formatNumber } from '@/utils/formatters';
import { mockUsers } from '@/mocks/data';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const { videos } = useVideoStore();
  const [activeTab, setActiveTab] = useState('videos');
  const [user, setUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Find the user by ID
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const foundUser = mockUsers.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [id]);
  
  // Filter videos to only show this user's videos
  const userVideos = videos.filter(video => video.userId === id && !video.isPrivate);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderVideoItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => {
        router.push({
          pathname: '/(tabs)',
          params: { videoId: item.id }
        });
      }}
    >
      <Image 
        source={{ uri: item.videoUrl.replace('.mp4', '.jpg') || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' }} 
        style={styles.videoThumbnail}
        contentFit="cover"
      />
      <View style={styles.videoOverlay}>
        <Text style={styles.videoViews}>{formatNumber(item.likes * 2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{user.username}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(userVideos.length)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(user.followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(user.following)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.bio}>{user.bio || 'No bio yet'}</Text>
        
        {currentUser?.id !== user.id && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isFollowing ? styles.unfollowButton : styles.followButton]} 
              onPress={handleFollow}
            >
              <Text style={styles.actionButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]} 
            onPress={() => setActiveTab('videos')}
          >
            <Grid size={20} color={activeTab === 'videos' ? Colors.dark.text : Colors.dark.inactive} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]} 
            onPress={() => setActiveTab('liked')}
          >
            <Bookmark size={20} color={activeTab === 'liked' ? Colors.dark.text : Colors.dark.inactive} />
          </TouchableOpacity>
        </View>
        
        {activeTab === 'videos' && (
          userVideos.length > 0 ? (
            <FlatList
              data={userVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.videoGrid}
            />
          ) : (
            <View style={styles.emptyState}>
              <Grid size={50} color={Colors.dark.inactive} />
              <Text style={styles.emptyStateTitle}>No videos yet</Text>
              <Text style={styles.emptyStateText}>This user hasn't posted any videos yet</Text>
            </View>
          )
        )}
        
        {activeTab === 'liked' && (
          <View style={styles.emptyState}>
            <Bookmark size={50} color={Colors.dark.inactive} />
            <Text style={styles.emptyStateTitle}>Liked videos</Text>
            <Text style={styles.emptyStateText}>This user's liked videos are private</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginTop: 5,
  },
  bio: {
    color: Colors.dark.text,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 10,
  },
  followButton: {
    backgroundColor: Colors.dark.primary,
  },
  unfollowButton: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  messageButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  messageButtonText: {
    color: Colors.dark.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark.text,
  },
  videoGrid: {
    padding: 1,
  },
  videoItem: {
    flex: 1/3,
    aspectRatio: 0.8,
    padding: 1,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoViews: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyStateTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});