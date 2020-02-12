import { useEffect, useState } from 'react';
import * as api from './api';

const defaultVariables = {};

export function useGraphql<T>(
  query: string,
  variables: api.GraphqlVariables = defaultVariables
) {
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(
    () => {
      setLoading(true);
      api
        .graphql(query, variables)
        .then(setResult)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    // this is truly idiotic: https://github.com/facebook/react/issues/14476#issuecomment-471199055
    [query, JSON.stringify(variables)] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    error,
    isLoading,
    result,
  };
}
