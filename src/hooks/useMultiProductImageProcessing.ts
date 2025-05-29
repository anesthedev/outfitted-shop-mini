import { useFalAi } from '@shopify/shop-minis-sdk';
import { useState, useRef, useEffect } from 'react';

import { MULTI_PRODUCT_ANALYSIS_PROMPT } from '../utils/multiProductPrompt';
import { extractMultiProductQueries } from '../utils/multiProductFormatters';

export interface ProductQueries {
  query1: string;
  query2: string;
  query3: string;
  query4: string;
  query5: string;
  query6: string;
}

export interface ProductResult {
  category: string;
  queries: ProductQueries;
}

export interface MultiProductAnalysis {
  product1: ProductResult;
  product2: ProductResult;
}

export const useMultiProductImageProcessing = (image: any) => {
  const [status, setStatus] = useState<string>('IN_QUEUE');
  const falAi = useFalAi();

  const processImage = async (): Promise<MultiProductAnalysis | null> => {
    try {
      const result = await falAi.subscribe('fal-ai/sa2va/8b/image', {
        input: {
          prompt: MULTI_PRODUCT_ANALYSIS_PROMPT,
          image_url: `data:image/jpeg;base64,${image.data}`,
        },
        mode: 'polling',
        pollInterval: 1000,
        onQueueUpdate: update => {
          if (update.status === 'IN_PROGRESS') {
            setStatus('IN_PROGRESS');
          }
        },
      });

      const data = result.data;
      const multiProductAnalysis = extractMultiProductQueries(data?.output);

      return multiProductAnalysis;
    } catch (error) {
      console.error('Error processing image with fal.ai:', error);
      return null;
    }
  };

  return { processImage, status };
};

export const useWarmUpMultiProductFalAi = () => {
  const falAi = useFalAi();
  const hasWarmedUp = useRef(false);

  useEffect(() => {
    const warmUp = async () => {
      if (hasWarmedUp.current) return;
      try {
        hasWarmedUp.current = true;
        await falAi.subscribe('fal-ai/sa2va/8b/image', {
          input: {
            prompt: 'Dummy',
            image_url:
              'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          },
        });
      } catch (error) {
        console.error('Failed to warm up FalAI:', error);
      }
    };

    warmUp();
  }, [falAi]);
};