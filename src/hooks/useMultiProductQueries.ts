import { useState, useCallback } from 'react';
import { MULTI_PRODUCT_SEARCH_PROMPT } from '../utils/aiPrompt';

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

interface UseMultiProductQueriesResult {
  analyzeImage: (imageUri: string) => Promise<MultiProductAnalysis | null>;
  isLoading: boolean;
  error: string | null;
}

export const useMultiProductQueries = (): UseMultiProductQueriesResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (imageUri: string): Promise<MultiProductAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert image to base64 if needed
      const base64Image = await convertImageToBase64(imageUri);
      
      // Prepare the request payload for the AI service
      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: MULTI_PRODUCT_SEARCH_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      };

      // Make API call to OpenAI or your preferred AI service
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      // Parse the JSON response
      const analysisResult: MultiProductAnalysis = JSON.parse(aiResponse);
      
      // Validate the response structure
      if (!analysisResult.product1 || !analysisResult.product2) {
        throw new Error('Invalid analysis result: missing products');
      }

      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error analyzing image:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeImage,
    isLoading,
    error,
  };
};

// Helper function to convert image URI to base64
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    // If it's already a base64 string, return it
    if (imageUri.startsWith('data:image/')) {
      return imageUri.split(',')[1];
    }

    // If it's a file URI, read and convert to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
};