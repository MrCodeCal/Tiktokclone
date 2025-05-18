import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react-native';
import { formatNumber } from '@/utils/formatters';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface VideoActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  userAvatar: string;
  userId: string;
  onUserPress: () => void;
}

const VideoActions: React.FC<VideoActionsProps> = ({
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  onComment,
  onShare,
  userAvatar,
  userId,
  onUserPress,
}) => {
  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onLike();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onUserPress}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View style={styles.plusIcon}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <Heart 
          size={35} 
          color={isLiked ? Colors.dark.primary : Colors.dark.text} 
          fill={isLiked ? Colors.dark.primary : 'transparent'} 
        />
        <Text style={styles.actionText}>{formatNumber(likes)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onComment}>
        <MessageCircle size={35} color={Colors.dark.text} />
        <Text style={styles.actionText}>{formatNumber(comments)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onShare}>
        <Share2 size={35} color={Colors.dark.text} />
        <Text style={styles.actionText}>{formatNumber(shares)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.musicDisc}>
        <View style={styles.disc}>
          <Music size={20} color={Colors.dark.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.dark.text,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -8,
    left: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: Colors.dark.text,
    marginTop: 5,
    fontSize: 12,
  },
  musicDisc: {
    marginTop: 10,
  },
  disc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#222',
  },
});

export default VideoActions;