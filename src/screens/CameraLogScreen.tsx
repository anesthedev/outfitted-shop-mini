import {useState, useCallback} from 'react'
import {ScrollView, TouchableOpacity, FlatList} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {
  Box,
  SafeAreaView,
  Text,
  useTheme,
  Button,
  Icon,
  Image,
  Divider,
  useImagePicker,
} from '@shopify/shop-minis-sdk'

import {RootStackParamList} from '../types/screens'

interface SelectedImage {
  id: string
  imageUrl: string
  timestamp: Date
  source: 'camera' | 'gallery'
}

interface LogEntry {
  id: string
  images: SelectedImage[]
  timestamp: Date
  message: string
}

export function CameraLogScreen() {
  const theme = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {openCamera, openPicker} = useImagePicker()
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])

  const MAX_IMAGES = 6

  const takePicture = useCallback(async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      console.log('Maximum number of images reached')
      return
    }

    try {
      const image = await openCamera({})
      const newImage: SelectedImage = {
        id: Date.now().toString(),
        imageUrl: image.path,
        timestamp: new Date(),
        source: 'camera'
      }
      
      setSelectedImages(prev => [...prev, newImage])
      console.log('New photo added from camera')
    } catch (error) {
      console.log('Camera error:', error)
    }
  }, [openCamera, selectedImages.length])

  const selectFromGallery = useCallback(async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      console.log('Maximum number of images reached')
      return
    }

    try {
      const image = await openPicker({})
      const newImage: SelectedImage = {
        id: Date.now().toString(),
        imageUrl: image.path,
        timestamp: new Date(),
        source: 'gallery'
      }
      
      setSelectedImages(prev => [...prev, newImage])
      console.log('New photo added from gallery')
    } catch (error) {
      console.log('Gallery error:', error)
    }
  }, [openPicker, selectedImages.length])

  const selectMultipleFromGallery = useCallback(async () => {
    const remainingSlots = MAX_IMAGES - selectedImages.length
    if (remainingSlots <= 0) {
      console.log('Maximum number of images reached')
      return
    }

    try {
      // Try to use multiple selection if supported, otherwise fall back to single selection
      const image = await openPicker({
        multiple: true,
        maxFiles: remainingSlots
      })
      
      // Handle both single image and array of images
      const images = Array.isArray(image) ? image : [image]
      
      const newImages: SelectedImage[] = images.slice(0, remainingSlots).map((img, index) => ({
        id: `${Date.now()}_${index}`,
        imageUrl: img.path,
        timestamp: new Date(),
        source: 'gallery'
      }))
      
      setSelectedImages(prev => [...prev, ...newImages])
      console.log(`${newImages.length} photos added from gallery`)
    } catch (error) {
      console.log('Multiple gallery selection error:', error)
      // Fallback to single selection
      selectFromGallery()
    }
  }, [openPicker, selectedImages.length, selectFromGallery])

  const removeImage = useCallback((imageId: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId))
    console.log('Image removed')
  }, [])

  const clearAllImages = useCallback(() => {
    setSelectedImages([])
    console.log('All selected images cleared')
  }, [])

  const saveAsLogEntry = useCallback(() => {
    if (selectedImages.length === 0) {
      console.log('No images to save')
      return
    }

    const newLogEntry: LogEntry = {
      id: Date.now().toString(),
      images: [...selectedImages],
      timestamp: new Date(),
      message: `Photo set with ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} - ${new Date().toLocaleString()}`
    }
    
    setLogEntries(prev => [newLogEntry, ...prev])
    setSelectedImages([]) // Clear selection after saving
    console.log('Photo set saved as log entry:', newLogEntry.message)
  }, [selectedImages])

  const clearLogs = useCallback(() => {
    setLogEntries([])
    console.log('Photo logs cleared')
  }, [])

  const renderSelectedImage = ({item, index}: {item: SelectedImage, index: number}) => (
    <Box 
      marginRight="xs" 
      marginBottom="xs"
      style={{width: 100}}
    >
      <Box
        style={{
          width: 100,
          height: 100,
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          source={{uri: item.imageUrl}}
          style={{width: 100, height: 100}}
        />
        <TouchableOpacity
          onPress={() => removeImage(item.id)}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          accessibilityLabel="Remove image"
        >
          <Icon name="close" size="s" color="text-inverse" />
        </TouchableOpacity>
      </Box>
      <Text variant="caption" marginTop="xs" textAlign="center">
        {item.source === 'camera' ? '📷' : '🖼️'} {index + 1}
      </Text>
    </Box>
  )

  const renderLogEntry = ({item}: {item: LogEntry}) => (
    <Box 
      marginBottom="s" 
      padding="s" 
      backgroundColor="backgrounds-brand-secondary"
      borderRadius="radius-8"
    >
      <Box marginBottom="s">
        <Text variant="bodyLarge" numberOfLines={2}>
          {item.message}
        </Text>
        <Text variant="bodySmall" color="text-secondary" marginTop="xs">
          {item.timestamp.toLocaleString()}
        </Text>
      </Box>
      <Box flexDirection="row" flexWrap="wrap">
        {item.images.map((image, index) => (
          <Box 
            key={image.id}
            marginRight="xs" 
            marginBottom="xs"
            style={{width: 60}}
          >
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{uri: image.imageUrl}}
                style={{width: 60, height: 60}}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors['backgrounds-regular']}}
    >
      <Box
        flex={1}
        paddingHorizontal="gutter"
        backgroundColor="backgrounds-regular"
      >
        <Box>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityLabel="Navigate back"
          >
            <Box marginTop="xs">
              <Icon name="arrow-left" />
            </Box>
          </TouchableOpacity>
        </Box>
        
        <Text variant="heroBold" marginBottom="s" marginTop="xs">
          Multi-Photo Logger
        </Text>
        
        <Text variant="subtitle" marginBottom="s">
          Capture photos with camera or select single/multiple images from gallery (up to {MAX_IMAGES} total).
        </Text>

        {/* Action Buttons */}
        <Box marginBottom="s">
          <Box flexDirection="row" marginBottom="s">
            <Box flex={1} marginRight="xs">
              <Button
                text="📸 Camera"
                onPress={takePicture}
                variant="primary"
                disabled={selectedImages.length >= MAX_IMAGES}
              />
            </Box>
            <Box flex={1} marginLeft="xs">
              <Button
                text="🖼️ Gallery"
                onPress={selectFromGallery}
                variant="secondary"
                disabled={selectedImages.length >= MAX_IMAGES}
              />
            </Box>
          </Box>
          <Box marginBottom="s">
            <Button
              text="🖼️✨ Select Multiple from Gallery"
              onPress={selectMultipleFromGallery}
              variant="tertiary"
              disabled={selectedImages.length >= MAX_IMAGES}
            />
          </Box>
          <Text variant="bodySmall" textAlign="center" color="text-secondary">
            {selectedImages.length}/{MAX_IMAGES} images selected
            {selectedImages.length < MAX_IMAGES && (
              ` • ${MAX_IMAGES - selectedImages.length} remaining`
            )}
          </Text>
          <Text variant="caption" textAlign="center" color="text-secondary" marginTop="xs">
            💡 Use "Select Multiple" to choose several gallery images at once
          </Text>
        </Box>

        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <Box marginBottom="s">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
              <Text variant="subtitle">Selected Images</Text>
              <TouchableOpacity onPress={clearAllImages}>
                <Text variant="bodySmall" color="text-brand">Clear All</Text>
              </TouchableOpacity>
            </Box>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 12}}>
              <Box flexDirection="row">
                {selectedImages.map((image, index) => 
                  renderSelectedImage({item: image, index})
                )}
              </Box>
            </ScrollView>
            <Button
              text={`💾 Save ${selectedImages.length} Image${selectedImages.length > 1 ? 's' : ''} as Log`}
              onPress={saveAsLogEntry}
              variant="primary"
            />
          </Box>
        )}

        {logEntries.length > 0 && (
          <Box marginBottom="s">
            <Button
              text="Clear All Logs"
              variant="tertiary"
              onPress={clearLogs}
            />
          </Box>
        )}

        <Divider marginVertical="s" />

        {/* Log Entries */}
        <Box flex={1}>
          <Text variant="subtitle" marginBottom="s">
            Photo Log Entries ({logEntries.length})
          </Text>
          
          {logEntries.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text variant="bodyLarge" textAlign="center" color="text-secondary">
                No photo sets logged yet.{'\n'}Select or capture some photos to get started!
              </Text>
            </Box>
          ) : (
            <FlatList
              data={logEntries}
              renderItem={renderLogEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  )
} 