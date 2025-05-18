import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text as RNText, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Colors from '@/constants/colors';

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, isActive }) => {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      playVideo();
    } else {
      pauseVideo();
    }
  }, [isActive]);

  const playVideo = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.playAsync();
      } catch (e) {
        console.error('Error playing video:', e);
        setError('Failed to play video');
      }
    }
  };

  const pauseVideo = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.pauseAsync();
      } catch (e) {
        console.error('Error pausing video:', e);
      }
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsLoading(false);
      if (status.didJustFinish) {
        // Loop the video
        videoRef.current?.replayAsync();
      }
    } else if (status.error) {
      setError(`Error loading video: ${status.error}`);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri }}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={isActive}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls={false}
        isMuted={false}
      />
      
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <RNText style={styles.errorText}>Failed to load video</RNText>
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  video: {
    width,
    height: Platform.OS === 'web' ? height - 100 : height,
    backgroundColor: Colors.dark.background,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: 16,
  }
});

export default VideoPlayer;