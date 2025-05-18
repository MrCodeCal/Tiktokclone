import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import { Image } from 'expo-image';
import { X, Heart, Send } from 'lucide-react-native';
import { Comment } from '@/types';
import { formatNumber, formatTimeAgo } from '@/utils/formatters';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface CommentsSheetProps {
  comments: Comment[];
  onClose: () => void;
}

const CommentsSheet: React.FC<CommentsSheetProps> = ({ comments, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const { currentUser, isAuthenticated } = useAuth();

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated || !currentUser) {
      Alert.alert("Sign In Required", "Please sign in to comment");
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      text: newComment.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    setLocalComments([comment, ...localComments]);
    setNewComment('');
    Keyboard.dismiss();
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to like comments");
      return;
    }

    if (likedComments.includes(commentId)) {
      // Unlike
      setLikedComments(likedComments.filter(id => id !== commentId));
      setLocalComments(localComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: Math.max(0, comment.likes - 1) } 
          : comment
      ));
    } else {
      // Like
      setLikedComments([...likedComments, commentId]);
      setLocalComments(localComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 } 
          : comment
      ));
    }
  };

  const handleUserPress = (userId: string) => {
    onClose();
    router.push({
      pathname: `/user/${userId}`,
    });
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <TouchableOpacity onPress={() => handleUserPress(item.userId)}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <TouchableOpacity onPress={() => handleUserPress(item.userId)}>
          <Text style={styles.username}>{item.user.username}</Text>
        </TouchableOpacity>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentMeta}>
          <Text style={styles.timeText}>{formatTimeAgo(item.createdAt)}</Text>
          <TouchableOpacity style={styles.replyButton}>
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => handleLikeComment(item.id)}
      >
        <Heart 
          size={20} 
          color={likedComments.includes(item.id) ? Colors.dark.primary : Colors.dark.subtext} 
          fill={likedComments.includes(item.id) ? Colors.dark.primary : 'transparent'}
        />
        <Text style={styles.likeCount}>{formatNumber(item.likes)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{localComments.length} comments</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={localComments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentsList}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.dark.subtext}
          value={newComment}
          onChangeText={setNewComment}
          returnKeyType="send"
          onSubmitEditing={handleSubmitComment}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !newComment ? styles.sendButtonDisabled : null
          ]}
          disabled={!newComment}
          onPress={handleSubmitComment}
        >
          <Send size={20} color={!newComment ? Colors.dark.inactive : Colors.dark.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    position: 'relative',
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  commentsList: {
    padding: 15,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: Colors.dark.text,
    marginBottom: 6,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginRight: 15,
  },
  replyButton: {
    marginRight: 15,
  },
  replyText: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  likeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  likeCount: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: Colors.dark.text,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentsSheet;