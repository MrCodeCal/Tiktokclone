import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert, TextInput, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Settings, Grid, Bookmark, Lock, Edit3, LogOut, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoStore } from '@/stores/videoStore';
import { formatNumber } from '@/utils/formatters';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { videos } = useVideoStore();
  const [activeTab, setActiveTab] = useState('videos');
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState(currentUser?.username || '');
  const [editedBio, setEditedBio] = useState(currentUser?.bio || '');
  
  // Filter videos to only show the current user's videos
  const userVideos = videos.filter(video => video.userId === currentUser?.id);
  
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setEditedUsername(currentUser.username);
    setEditedBio(currentUser.bio || '');
    setIsEditProfileVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editedUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    await updateProfile({
      username: editedUsername,
      bio: editedBio,
    });

    setIsEditProfileVisible(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await updateProfile({
          avatar: result.assets[0].uri,
        });
        Alert.alert("Success", "Profile picture updated successfully");
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const renderVideoItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => {
        // Navigate to the video in the feed
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
        <Text style={styles.headerTitle}>@{currentUser.username}</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
          <LogOut size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <View style={styles.cameraIcon}>
              <Camera size={16} color={Colors.dark.text} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(userVideos.length)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(currentUser.followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(currentUser.following)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.bio}>{currentUser.bio || 'No bio yet'}</Text>
        
        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        
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
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'private' && styles.activeTab]} 
            onPress={() => setActiveTab('private')}
          >
            <Lock size={20} color={activeTab === 'private' ? Colors.dark.text : Colors.dark.inactive} />
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
              <Text style={styles.emptyStateText}>Your videos will appear here</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/upload')}
              >
                <Text style={styles.createButtonText}>Create Your First Video</Text>
              </TouchableOpacity>
            </View>
          )
        )}
        
        {activeTab === 'liked' && (
          <View style={styles.emptyState}>
            <Bookmark size={50} color={Colors.dark.inactive} />
            <Text style={styles.emptyStateTitle}>Liked videos</Text>
            <Text style={styles.emptyStateText}>Videos you've liked will appear here</Text>
          </View>
        )}
        
        {activeTab === 'private' && (
          <View style={styles.emptyState}>
            <Lock size={50} color={Colors.dark.inactive} />
            <Text style={styles.emptyStateTitle}>Private videos</Text>
            <Text style={styles.emptyStateText}>Videos you've set to private will appear here</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isEditProfileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={editedUsername}
              onChangeText={setEditedUsername}
              placeholder="Enter username"
              placeholderTextColor={Colors.dark.subtext}
            />
            
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editedBio}
              onChangeText={setEditedBio}
              placeholder="Tell something about yourself"
              placeholderTextColor={Colors.dark.subtext}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsEditProfileVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    position: 'absolute',
    right: 15,
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
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
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
  editProfileButton: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  editProfileText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    color: Colors.dark.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 5,
    padding: 10,
    color: Colors.dark.text,
    marginBottom: 15,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.dark.border,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
  },
  cancelButtonText: {
    color: Colors.dark.text,
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});