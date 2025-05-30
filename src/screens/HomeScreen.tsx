import {useState} from 'react'
import {ScrollView, Alert} from 'react-native'
import {
  Box,
  SafeAreaView,
  Text,
  Button,
  useTheme,
  Grid,
  ImageBox,
  Icon,
  Divider,
  ProductCard,
  TouchableProduct,
  useProductSearch,
  Badge,
  Spinner,
  useImagePicker,
} from '@shopify/shop-minis-sdk'

export function HomeScreen() {
  const theme = useTheme()
  const {openPicker, openCamera} = useImagePicker()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Simulating outfit suggestions based on mood board
  // In a real app, this would be based on AI/ML analysis of uploaded images
  const {products, loading: productsLoading} = useProductSearch({
    query: showSuggestions ? 'fashion outfit clothing' : '',
    first: 8,
    filters: {
      minimumRating: 4,
    },
  })

  const handleImageUpload = async () => {
    try {
      setIsUploading(true)
      
      // Open image picker
      const image = await openPicker({})
      if (image && image.path) {
        setUploadedImages([...uploadedImages, image.path])
        Alert.alert('Success', 'Image added to mood board!')
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Image picker cancelled or error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      setIsUploading(true)
      
      // Open camera
      const image = await openCamera({})
      if (image && image.path) {
        setUploadedImages([...uploadedImages, image.path])
        Alert.alert('Success', 'Photo added to mood board!')
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Camera cancelled or error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGetSuggestions = () => {
    if (uploadedImages.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image to your mood board')
      return
    }
    setShowSuggestions(true)
  }

  const handleClearMoodBoard = () => {
    setUploadedImages([])
    setShowSuggestions(false)
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors['backgrounds-regular']}}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          flex={1}
          paddingHorizontal="gutter"
          paddingVertical="m"
          backgroundColor="backgrounds-regular"
        >
          {/* Header Section */}
          <Box alignItems="center" marginBottom="l">
            <Icon name="star" size="xl" color="foregrounds-primary" />
            <Text variant="heroBold" marginTop="s" textAlign="center">
              Outfit Mood Board
            </Text>
            <Text variant="bodySmall" marginTop="xs" textAlign="center" color="foregrounds-subdued">
              Upload your style inspiration and discover perfect outfits from top merchants
            </Text>
          </Box>

          <Divider marginBottom="m" />

          {/* Upload Section */}
          <Box marginBottom="l">
            <Box flexDirection="row" alignItems="center" marginBottom="s">
              <Box flex={1}>
                <Text variant="subtitle">
                  Your Mood Board
                </Text>
              </Box>
              {uploadedImages.length > 0 && (
                <Badge text={`${uploadedImages.length} images`} />
              )}
            </Box>

            {/* Image Grid */}
            {uploadedImages.length > 0 ? (
              <Box marginBottom="m">
                <Box flexDirection="row" flexWrap="wrap" gap="s">
                  {uploadedImages.map((uri, index) => (
                    <Box
                      key={`image-${index}`}
                      width="31%"
                      aspectRatio={0.75}
                      borderRadius="s"
                      overflow="hidden"
                      borderWidth={1}
                      borderColor="borders-regular"
                    >
                      <ImageBox
                        source={{uri}}
                        style={{width: '100%', height: '100%'}}
                        resizeMode="cover"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                backgroundColor="backgrounds-subdued"
                borderRadius="m"
                padding="xl"
                alignItems="center"
                marginBottom="m"
                borderWidth={2}
                borderColor="borders-regular"
                borderStyle="dashed"
              >
                <Icon name="camera" size="xl" color="foregrounds-subdued" />
                <Text variant="bodySmall" marginTop="s" color="foregrounds-subdued" textAlign="center">
                  Upload images to create your style mood board
                </Text>
              </Box>
            )}

            {/* Action Buttons */}
            <Box gap="s">
              <Button
                text={isUploading ? "Loading..." : "Upload from Gallery"}
                size="l"
                variant="primary"
                onPress={handleImageUpload}
                disabled={isUploading}
              />
              <Button
                text="Take a Photo"
                size="l"
                variant="secondary"
                onPress={handleCameraCapture}
                disabled={isUploading}
              />
              
              {uploadedImages.length > 0 && (
                <>
                  <Button
                    text="Get Outfit Suggestions"
                    size="l"
                    variant="secondary"
                    onPress={handleGetSuggestions}
                  />
                  <Button
                    text="Clear Mood Board"
                    size="m"
                    variant="tertiary"
                    onPress={handleClearMoodBoard}
                  />
                </>
              )}
            </Box>
          </Box>

          {/* Suggestions Section */}
          {showSuggestions && (
            <>
              <Divider marginBottom="m" />
              <Box marginBottom="m">
                <Text variant="subtitle" marginBottom="s">
                  Suggested Outfits
                </Text>
                <Text variant="bodySmall" color="foregrounds-subdued" marginBottom="m">
                  Based on your mood board, here are some perfect matches from our merchants
                </Text>

                {productsLoading ? (
                  <Box alignItems="center" paddingVertical="xl">
                    <Spinner />
                    <Text variant="bodySmall" marginTop="s" color="foregrounds-subdued">
                      Finding perfect outfits...
                    </Text>
                  </Box>
                ) : products && products.length > 0 ? (
                  <Box flexDirection="row" flexWrap="wrap" gap="s">
                    {products.map((product) => (
                      <Box key={product.id} width="48%">
                        <TouchableProduct product={product}>
                          <ProductCard product={product} />
                        </TouchableProduct>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    backgroundColor="backgrounds-subdued"
                    borderRadius="m"
                    padding="l"
                    alignItems="center"
                  >
                    <Text variant="bodySmall" color="foregrounds-subdued">
                      No suggestions available at the moment
                    </Text>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}
