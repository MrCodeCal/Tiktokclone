import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, UserPlus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockUsers } from '@/mocks/data';
import { formatTimeAgo } from '@/utils/formatters';

// Activity types
const LIKE = 'LIKE';
const COMMENT = 'COMMENT';
const FOLLOW = 'FOLLOW';

// Generate mock activities
const mockActivities = [
  {
    id: '1',
    type: LIKE,
    user: mockUsers[1],
    content: 'liked your video',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    time: '2023-09-15T20:30:00Z',
  },
  {
    id: '2',
    type: COMMENT,
    user: mockUsers[2],
    content: 'commented: "This is amazing! 🔥"',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    time: '2023-09-15T18:45:00Z',
  },
  {
    id: '3',
    type: FOLLOW,
    user: mockUsers[3],
    content: 'started following you',
    videoThumbnail: null,
    time: '2023-09-15T15:20:00Z',
  },
  {
    id: '4',
    type: LIKE,
    user: mockUsers[4],
    content: 'liked your comment',
    videoThumbnail: null,
    time: '2023-09-14T22:10:00Z',
  },
  {
    id: '5',
    type: COMMENT,
    user: mockUsers[0],
    content: 'replied to your comment: "Thank you!"',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    time: '2023-09-14T20:05:00Z',
  },
  {
    id: '6',
    type: FOLLOW,
    user: mockUsers[1],
    content: 'started following you',
    videoThumbnail: null,
    time: '2023-09-14T14:30:00Z',
  },
  {
    id: '7',
    type: LIKE,
    user: mockUsers[2],
    content: 'liked your video',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    time: '2023-09-13T19:15:00Z',
  },
  {
    id: '8',
    type: COMMENT,
    user: mockUsers[3],
    content: 'commented: "Can you do a tutorial?"',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    time: '2023-09-13T16:40:00Z',
  },
];

export default function ActivityScreen() {
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case LIKE:
        return <Heart size={20} color={Colors.dark.primary} fill={Colors.dark.primary} />;
      case COMMENT:
        return <MessageCircle size={20} color={Colors.dark.secondary} />;
      case FOLLOW:
        return <UserPlus size={20} color="#5E72E4" />;
      default:
        return null;
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.activityItem}>
      <View style={styles.iconContainer}>
        {renderActivityIcon(item.type)}
      </View>
      
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.username}>@{item.user.username}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>{formatTimeAgo(item.time)}</Text>
      </View>
      
      {item.videoThumbnail && (
        <Image source={{ uri: item.videoThumbnail }} style={styles.thumbnail} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      
      <FlatList
        data={mockActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    color: Colors.dark.text,
    marginBottom: 4,
  },
  time: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  thumbnail: {
    width: 50,
    height: 70,
    borderRadius: 4,
    marginLeft: 10,
  },
});