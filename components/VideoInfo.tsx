import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Music } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface VideoInfoProps {
  username: string;
  description: string;
  userId: string;
  onUserPress: () => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ username, description, userId, onUserPress }) => {
  // Extract hashtags from description
  const parts = description.split(/(\s+)/).map((part, index) => {
    if (part.startsWith('#')) {
      return (
        <Text key={index} style={styles.hashtag}>
          {part}
        </Text>
      );
    }
    return part;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUserPress}>
        <Text style={styles.username}>@{username}</Text>
      </TouchableOpacity>
      <Text style={styles.description}>{parts}</Text>
      
      <View style={styles.musicContainer}>
        <Music size={16} color={Colors.dark.text} />
        <Text style={styles.musicText}>
          {username} • Original Sound
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    maxWidth: '70%',
    padding: 10,
  },
  username: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 10,
  },
  hashtag: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: Colors.dark.text,
    fontSize: 14,
    marginLeft: 8,
  },
});

export default VideoInfo;