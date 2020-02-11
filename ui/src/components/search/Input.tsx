import React from 'react';
import classnames from 'classnames';
import { debounce } from 'lodash';
import * as api from '../../api';
import { SearchResult, SearchSuggestion } from './types';
import Suggestions from './Suggestions';

interface SearchInputProps {
  autoFocus: boolean;
  className?: string;
  onSearch: (text: string) => void;
  onSuggestion?: (suggestion: SearchSuggestion) => void;
  query?: string;
}

interface SearchInputState {
  suggestions: SearchSuggestion[];
  suggestionsVisible: boolean;
  value: string;
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
      value: props.query || '',
    };
  }

  async suggestRaw(text: string) {
    const response = await api.search(text, 5, ['appearance', 'name']);
    this.setState({
      suggestions: response.results.map(resultToSuggestion),
      suggestionsVisible: true,
    });
  }

  suggest = debounce(this.suggestRaw, 250);

  async startSuggest() {
    const text = this.state.value;
    if (!text) {
      this.suggest.cancel();
      this.setState({
        suggestions: [],
        suggestionsVisible: false,
      });
      return;
    }
    this.suggest(text);
  }

  onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      value: e.currentTarget.value,
    });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const { onSearch } = this.props;
    const { value } = this.state;
    this.suggest.cancel();
    this.setState({
      suggestionsVisible: false,
    });
    onSearch(value);
  };

  async componentDidUpdate(
    prevProps: Readonly<SearchInputProps>,
    prevState: Readonly<SearchInputState>
  ) {
    if (prevState.value !== this.state.value) {
      this.startSuggest();
    }
  }

  render() {
    const { autoFocus, className } = this.props;
    const { suggestions, suggestionsVisible, value } = this.state;
    return (
      <div
        className={classnames('search-input', className, {
          'suggestions-visible': suggestionsVisible,
        })}
      >
        <input
          autoFocus={autoFocus}
          value={value}
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
