import { SearchSuggestion } from './types';
import React from 'react';
import EntityLink from '../links/EntityLink';

interface SuggestionProps {
  className: string;
  suggestion: SearchSuggestion;
}

const Suggestion: React.FunctionComponent<SuggestionProps> = props => {
  const { className, suggestion } = props;
  return (
    <EntityLink className={className} id={suggestion.id} type={suggestion.type}>
      <div className="description">{suggestion.description}</div>
      <div className="type">{suggestion.type}</div>
    </EntityLink>
  );
};

export default Suggestion;
