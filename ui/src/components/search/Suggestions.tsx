import React from 'react';
import { isEmpty } from 'lodash';
import { SearchSuggestion } from './types';
import Suggestion from './Suggestion';

interface Props {
  className: string;
  onClick?: () => void;
  suggestions: SearchSuggestion[];
}

function renderNoSuggestions() {
  return <div className="no-results">No results found.</div>;
}

function renderSuggestions(props: Props) {
  const { onClick, suggestions } = props;
  return suggestions.map(suggestion => (
    <Suggestion
      className="suggestion"
      key={`${suggestion.type}.${suggestion.id}`}
      onClick={onClick}
      suggestion={suggestion}
    />
  ));
}

const Suggestions: React.FunctionComponent<Props> = props => {
  const { className, suggestions } = props;
  return (
    <div className={className}>
      {isEmpty(suggestions) ? renderNoSuggestions() : renderSuggestions(props)}
    </div>
  );
};

export default Suggestions;
