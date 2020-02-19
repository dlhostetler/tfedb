import { SearchSuggestion } from './types';
import React from 'react';
import EntityLink from '../links/EntityLink';

interface Props {
  className: string;
  onClick?: () => void;
  onSuggestion?: (suggestion: SearchSuggestion) => void;
  suggestion: SearchSuggestion;
}

const Suggestion: React.FunctionComponent<Props> = props => {
  const { className, onClick, suggestion } = props;
  return (
    <EntityLink
      className={className}
      id={suggestion.id}
      onClick={onClick}
      type={suggestion.type}
    >
      <div className="description">{suggestion.description}</div>
      <div className="type">{suggestion.type}</div>
    </EntityLink>
  );
};

export default Suggestion;
