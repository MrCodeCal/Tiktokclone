import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { X, Upload, Camera, Video, Music, Hash } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useVideoStore } from '@/stores/videoStore';
import { useAuth } from '@/contexts/AuthContext';
import UploadProgress from '@/components/UploadProgress';

export default function UploadScreen() {
  const { currentUser } = useAuth();
  const { addVideo } = useVideoStore();
  
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('Preparing...');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload videos!');
        }
      }
    })();
  }, []);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        // In a real app, we would generate a thumbnail from the video
        // For now, we'll use a placeholder
        setThumbnailUri('https://images.unsplash.com/photo-1611162616475-46b635cb6868');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!videoUri || !currentUser) {
      Alert.alert('Error', 'Please select a video to upload');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please add a description for your video');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
      
      if (uploadProgress < 30) {
        setUploadStatus('Uploading video...');
      } else if (uploadProgress < 60) {
        setUploadStatus('Processing...');
      } else if (uploadProgress < 90) {
        setUploadStatus('Almost done...');
      }
    }, 300);
    
    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus('Complete!');
      
      // Add the new video to the store
      const newVideo = {
        id: Date.now().toString(),
        userId: currentUser.id,
        user: currentUser,
        videoUrl: videoUri,
        description: description,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        isPrivate: isPrivate,
      };
      
      addVideo(newVideo);
      
      // Navigate back to the feed after a short delay
      setTimeout(() => {
        setIsUploading(false);
        Alert.alert(
          'Success',
          'Your video has been uploaded successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }, 1000);
    }, 3000);
  };

  const recordVideo = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Video recording is not available on web');
      return;
    }
    
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to record videos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
        videoMaxDuration: 60,
      });
      
      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        setThumbnailUri('https://images.unsplash.com/photo-1611162616475-46b635cb6868');
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const addHashtag = () => {
    setDescription(prev => prev + ' #mrtok');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Video</Text>
        <TouchableOpacity 
          style={[styles.uploadButton, (!videoUri || !description.trim()) && styles.uploadButtonDisabled]} 
          onPress={handleUpload}
          disabled={!videoUri || !description.trim()}
        >
          <Text style={styles.uploadText}>Post</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.videoPreviewContainer}>
          {videoUri ? (
            <Image 
              source={{ uri: thumbnailUri || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' }} 
              style={styles.videoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.uploadOptions}>
                <TouchableOpacity style={styles.uploadOption} onPress={pickVideo}>
                  <Upload size={40} color={Colors.dark.text} />
                  <Text style={styles.uploadOptionText}>Upload</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.uploadOption} onPress={recordVideo}>
                  <Camera size={40} color={Colors.dark.text} />
                  <Text style={styles.uploadOptionText}>Record</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.uploadHint}>Videos can be up to 60 seconds</Text>
            </View>
          )}
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your video..."
            placeholderTextColor={Colors.dark.subtext}
            multiline
            value={description}
            onChangeText={setDescription}
          />
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={addHashtag}>
              <Hash size={20} color={Colors.dark.text} />
              <Text style={styles.optionText}>Add Hashtag</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton}>
              <Music size={20} color={Colors.dark.text} />
              <Text style={styles.optionText}>Add Sound</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyTitle}>Who can view this video</Text>
            <View style={styles.privacyOptions}>
              <TouchableOpacity 
                style={[styles.privacyOption, !isPrivate && styles.selectedPrivacyOption]} 
                onPress={() => setIsPrivate(false)}
              >
                <Text style={[styles.privacyOptionText, !isPrivate && styles.selectedPrivacyText]}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.privacyOption, isPrivate && styles.selectedPrivacyOption]} 
                onPress={() => setIsPrivate(true)}
              >
                <Text style={[styles.privacyOptionText, isPrivate && styles.selectedPrivacyText]}>Private</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {isUploading && (
        <UploadProgress progress={uploadProgress} status={uploadStatus} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  uploadButtonDisabled: {
    backgroundColor: Colors.dark.inactive,
  },
  uploadText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  videoPreviewContainer: {
    aspectRatio: 9/16,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 20,
  },
  uploadOptionText: {
    color: Colors.dark.text,
    marginTop: 10,
    fontSize: 16,
  },
  uploadHint: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 15,
    color: Colors.dark.text,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    color: Colors.dark.text,
    marginTop: 5,
    fontSize: 12,
  },
  privacyContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 15,
  },
  privacyTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    marginBottom: 10,
  },
  privacyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  privacyOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedPrivacyOption: {
    backgroundColor: Colors.dark.primary,
  },
  privacyOptionText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  selectedPrivacyText: {
    fontWeight: 'bold',
  },
});