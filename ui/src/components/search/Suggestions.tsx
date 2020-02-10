import React from 'react';
import { isEmpty } from 'lodash';
import { SearchSuggestion } from './types';
import Suggestion from './Suggestion';

interface SuggestionsProps {
  className: string;
  suggestions: SearchSuggestion[];
}

function renderNoSuggestions() {
  return <div className="no-results">No results found.</div>;
}

function renderSuggestions(suggestions: SearchSuggestion[]) {
  return suggestions.map(suggestion => (
    <Suggestion
      className="suggestion"
      key={`${suggestion.type}.${suggestion.id}`}
      suggestion={suggestion}
    />
  ));
}

const Suggestions: React.FunctionComponent<SuggestionsProps> = props => {
  const { className, suggestions } = props;
  return (
    <div className={className}>
      {isEmpty(suggestions)
        ? renderNoSuggestions()
        : renderSuggestions(suggestions)}
    </div>
  );
};

export default Suggestions;
