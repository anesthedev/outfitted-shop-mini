import {useFalAi} from '@shopify/shop-minis-sdk'
import {useState, useRef, useEffect} from 'react'

import {IMAGE_SEGMENTATION_PROMPT} from '../utils/aiprompt'
import {extractSearchQueries, extractMaskUrl} from '../utils/formatters'

export const useImageProcessing = (image: any) => {
  const [status, setStatus] = useState<string>('IN_QUEUE')
  const falAi = useFalAi()
  const processImage = async () => {
    const result = await falAi.subscribe('fal-ai/sa2va/8b/image', {
      input: {
        prompt: IMAGE_SEGMENTATION_PROMPT,
        image_url: `data:image/jpeg;base64,${image.data}`,
      },
      mode: 'polling',
      pollInterval: 1000,
      onQueueUpdate: update => {
        if (update.status === 'IN_PROGRESS') {
          setStatus('IN_PROGRESS')
        }
      },
    })

    const data = result.data
    const searchQueries = extractSearchQueries(data?.output)
    const maskUrl = extractMaskUrl(data)

    return {searchQueries, maskUrl}
  }

  return {processImage, status}
}

export const useWarmUpFalAi = () => {
  const falAi = useFalAi()
  const hasWarmedUp = useRef(false)

  useEffect(() => {
    const warmUp = async () => {
      if (hasWarmedUp.current) return
      try {
        hasWarmedUp.current = true
        await falAi.subscribe('fal-ai/sa2va/8b/image', {
          input: {
            prompt: 'Dummy',
            image_url:
              'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          },
        })
      } catch (error) {
        console.error('Failed to warm up FalAI:', error)
      }
    }

    warmUp()
  }, [falAi])
}