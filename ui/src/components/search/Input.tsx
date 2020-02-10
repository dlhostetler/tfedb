import React from 'react';
import classnames from 'classnames';
import { debounce } from 'lodash';
import * as api from '../../api';
import { SearchResult, SearchSuggestion } from './types';
import Suggestion from './Suggestion';
import Suggestions from './Suggestions';

interface SearchInputProps {
  autoFocus: boolean;
  onSearch: (text: string) => void;
}

interface SearchInputState {
  suggestions: SearchSuggestion[];
  suggestionsVisible: boolean;
}

function resultToSuggestion(result: SearchResult): SearchSuggestion {
  return {
    description: result.fields.name || result.fields.appearance || 'Unknown',
    id: result.id,
    type: result.type,
  };
}

class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
  static defaultProps = {
    autoFocus: false,
    onSearch: () => {},
  };

  constructor(props: SearchInputProps) {
    super(props);

    this.state = {
      suggestions: [],
      suggestionsVisible: false,
    };
  }

  async suggestRaw(text: string) {
    const response = await api.search(text, 5, ['appearance', 'name']);
    this.setState({
      suggestions: response.results.map(resultToSuggestion),
      suggestionsVisible: true,
    });
  }

  suggest = debounce(this.suggestRaw, 1000);

  onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    if (!text) {
      this.suggest.cancel();
      this.setState({
        suggestions: [],
        suggestionsVisible: false,
      });
      return;
    }
    this.suggest(text);
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const { onSearch } = this.props;
    this.suggest.cancel();
    onSearch(e.currentTarget.value);
  };

  render() {
    const { autoFocus } = this.props;
    const { suggestions, suggestionsVisible } = this.state;
    return (
      <div
        className={classnames({
          'search-input': true,
          'suggestions-visible': suggestionsVisible,
        })}
      >
        <input
          autoFocus={autoFocus}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          type="search"
        />
        <Suggestions className="suggestions" suggestions={suggestions} />
      </div>
    );
  }
}

export default SearchInput;
