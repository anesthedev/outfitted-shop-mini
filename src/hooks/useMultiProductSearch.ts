import { useState, useRef, useEffect, useMemo } from 'react';
import { useProductSearchDeprecated } from '@shopify/shop-minis-sdk';

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

interface UseMultiProductSearchProps {
  analysis: MultiProductAnalysis | null;
  first?: number;
  includeSensitive?: boolean;
}

interface UseMultiProductSearchResult {
  product1Results: any[];
  product2Results: any[];
  isLoading: boolean;
  numberOfQueriesProcessed: number;
}

export const useMultiProductSearch = ({
  analysis,
  first = 20,
  includeSensitive = true,
}: UseMultiProductSearchProps): UseMultiProductSearchResult => {
  const [product1Results, setProduct1Results] = useState<any[]>([]);
  const [product2Results, setProduct2Results] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const processedQueries = useRef(new Set<string>());
  const queryResults = useRef<{ [key: string]: any[] }>({});

  // Extract queries for both products
  const product1Queries = useMemo(() => {
    if (!analysis?.product1?.queries) return [];
    return Object.values(analysis.product1.queries);
  }, [analysis?.product1?.queries]);

  const product2Queries = useMemo(() => {
    if (!analysis?.product2?.queries) return [];
    return Object.values(analysis.product2.queries);
  }, [analysis?.product2?.queries]);

  // Product 1 search hooks
  const p1Search1 = useProductSearchDeprecated({
    query: product1Queries[0] || '',
    first,
    includeSensitive,
  });

  const p1Search2 = useProductSearchDeprecated({
    query: product1Queries[1] || '',
    first,
    includeSensitive,
  });

  const p1Search3 = useProductSearchDeprecated({
    query: product1Queries[2] || '',
    first,
    includeSensitive,
  });

  const p1Search4 = useProductSearchDeprecated({
    query: product1Queries[3] || '',
    first,
    includeSensitive,
  });

  const p1Search5 = useProductSearchDeprecated({
    query: product1Queries[4] || '',
    first,
    includeSensitive,
  });

  const p1Search6 = useProductSearchDeprecated({
    query: product1Queries[5] || '',
    first,
    includeSensitive,
  });

  // Product 2 search hooks
  const p2Search1 = useProductSearchDeprecated({
    query: product2Queries[0] || '',
    first,
    includeSensitive,
  });

  const p2Search2 = useProductSearchDeprecated({
    query: product2Queries[1] || '',
    first,
    includeSensitive,
  });

  const p2Search3 = useProductSearchDeprecated({
    query: product2Queries[2] || '',
    first,
    includeSensitive,
  });

  const p2Search4 = useProductSearchDeprecated({
    query: product2Queries[3] || '',
    first,
    includeSensitive,
  });

  const p2Search5 = useProductSearchDeprecated({
    query: product2Queries[4] || '',
    first,
    includeSensitive,
  });

  const p2Search6 = useProductSearchDeprecated({
    query: product2Queries[5] || '',
    first,
    includeSensitive,
  });

  const allSearchResults = useMemo(
    () => ({
      product1: [
        p1Search1.products,
        p1Search2.products,
        p1Search3.products,
        p1Search4.products,
        p1Search5.products,
        p1Search6.products,
      ],
      product2: [
        p2Search1.products,
        p2Search2.products,
        p2Search3.products,
        p2Search4.products,
        p2Search5.products,
        p2Search6.products,
      ],
    }),
    [
      p1Search1.products,
      p1Search2.products,
      p1Search3.products,
      p1Search4.products,
      p1Search5.products,
      p1Search6.products,
      p2Search1.products,
      p2Search2.products,
      p2Search3.products,
      p2Search4.products,
      p2Search5.products,
      p2Search6.products,
    ]
  );

  useEffect(() => {
    if (!analysis) {
      setIsLoading(false);
      return;
    }

    // Process Product 1 results
    allSearchResults.product1.forEach((products, index) => {
      const queryKey = `p1_${index}`;
      if (
        products !== undefined &&
        !processedQueries.current.has(queryKey)
      ) {
        processedQueries.current.add(queryKey);
        if (products) {
          queryResults.current[queryKey] = products;
        }
      }
    });

    // Process Product 2 results
    allSearchResults.product2.forEach((products, index) => {
      const queryKey = `p2_${index}`;
      if (
        products !== undefined &&
        !processedQueries.current.has(queryKey)
      ) {
        processedQueries.current.add(queryKey);
        if (products) {
          queryResults.current[queryKey] = products;
        }
      }
    });

    // Update combined results
    updateCombinedResults();

    // Check if all queries are complete
    const totalExpectedQueries = 12; // 6 queries × 2 products
    if (processedQueries.current.size >= totalExpectedQueries) {
      setIsLoading(false);
    }
  }, [allSearchResults, analysis]);

  const updateCombinedResults = () => {
    // Combine Product 1 results
    const p1Products = Object.keys(queryResults.current)
      .filter(key => key.startsWith('p1_'))
      .flatMap(key => queryResults.current[key])
      .filter(Boolean);

    // Remove duplicates for Product 1
    const uniqueP1Products = p1Products.filter(
      (product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
    );

    // Combine Product 2 results
    const p2Products = Object.keys(queryResults.current)
      .filter(key => key.startsWith('p2_'))
      .flatMap(key => queryResults.current[key])
      .filter(Boolean);

    // Remove duplicates for Product 2
    const uniqueP2Products = p2Products.filter(
      (product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
    );

    setProduct1Results(uniqueP1Products);
    setProduct2Results(uniqueP2Products);
  };

  return {
    product1Results,
    product2Results,
    isLoading,
    numberOfQueriesProcessed: processedQueries.current.size,
  };
};