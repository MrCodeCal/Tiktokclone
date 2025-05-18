import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useVideoStore } from '@/stores/videoStore';
import { mockComments } from '@/mocks/data';
import VideoPlayer from '@/components/VideoPlayer';
import VideoActions from '@/components/VideoActions';
import VideoInfo from '@/components/VideoInfo';
import CommentsSheet from '@/components/CommentsSheet';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedScreen() {
  const { videos, likedVideos, currentVideoIndex, setCurrentVideoIndex, likeVideo, unlikeVideo, fetchVideos } = useVideoStore();
  const { isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [viewableItemIndex, setViewableItemIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  const { videoId } = params;

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    // If a specific videoId is provided in the URL, scroll to that video
    if (videoId && videos.length > 0) {
      const index = videos.findIndex(v => v.id === videoId);
      if (index !== -1) {
        setCurrentVideoIndex(index);
        flatListRef.current?.scrollToIndex({ index, animated: false });
      }
    }
  }, [videoId, videos]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setViewableItemIndex(index);
      setCurrentVideoIndex(index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const handleLike = (videoId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to like videos",
        [{ text: "OK" }]
      );
      return;
    }

    const video = videos.find(v => v.id === videoId);
    if (video?.isLiked) {
      unlikeVideo(videoId);
    } else {
      likeVideo(videoId);
    }
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to comment on videos",
        [{ text: "OK" }]
      );
      return;
    }
    setShowComments(true);
  };

  const handleShare = () => {
    Alert.alert(
      "Share",
      "Share this video with friends",
      [{ text: "Copy Link" }, { text: "Cancel", style: "cancel" }]
    );
  };

  const handleUserProfile = (userId: string) => {
    router.push({
      pathname: `/user/${userId}`,
    });
  };

  const renderItem = ({ item, index }: any) => {
    const isActive = index === viewableItemIndex;
    
    return (
      <View style={styles.videoContainer}>
        <VideoPlayer uri={item.videoUrl} isActive={isActive} />
        
        <VideoInfo 
          username={item.user.username} 
          description={item.description}
          userId={item.userId}
          onUserPress={() => handleUserProfile(item.userId)}
        />
        
        <VideoActions 
          likes={item.likes}
          comments={item.comments}
          shares={item.shares}
          isLiked={likedVideos.includes(item.id)}
          onLike={() => handleLike(item.id)}
          onComment={handleComment}
          onShare={handleShare}
          userAvatar={item.user.avatar}
          userId={item.userId}
          onUserPress={() => handleUserProfile(item.userId)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('forYou')}
        >
          <Text style={[styles.tabText, activeTab === 'forYou' && styles.activeTabText]}>For You</Text>
          {activeTab === 'forYou' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
          {activeTab === 'following' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={currentVideoIndex}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').height,
          offset: Dimensions.get('window').height * index,
          index,
        })}
      />
      
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <CommentsSheet 
            comments={mockComments} 
            onClose={() => setShowComments(false)} 
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  videoContainer: {
    height: Dimensions.get('window').height,
    position: 'relative',
  },
  tabSelector: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    color: Colors.dark.subtext,
    fontSize: 16,
  },
  activeTabText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  activeIndicator: {
    width: 20,
    height: 3,
    backgroundColor: Colors.dark.text,
    marginTop: 5,
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
  },
});