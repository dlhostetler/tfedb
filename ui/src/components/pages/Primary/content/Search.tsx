import React from 'react';
import { isEmpty } from 'lodash';
import qs from 'qs';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as api from '../../../../api';
import { SearchResult as SearchResultType } from '../../../search/types';
import Error from '../../../common/Error';
import SearchResult from '../../../search/Result';

type Props = RouteComponentProps;

interface State {
  error: any;
  isLoading: boolean;
  results: SearchResultType[];
  total: number;
}

class SearchPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
      isLoading: true,
      results: [],
      total: 0,
    };
  }

  query(props = this.props) {
    const { location } = props;
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    return params.q;
  }

  async startSearch() {
    const q = this.query();
    if (!q) {
      // there was nothing to query
      this.setState({
        error: null,
        isLoading: false,
      });
      return;
    }
    try {
      const fields = ['appearance', 'name'];
      const response = await api.search(q, 100, fields);
      this.setState({
        ...response,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        error: err,
        isLoading: false,
      });
    }
  }

  async componentDidMount() {
    this.startSearch();
  }

  async componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.query(prevProps) !== this.query()) {
      this.startSearch();
    }
  }

  renderError() {
    const { error } = this.state;
    if (!error) {
      return null;
    }
    return <Error error={error} />;
  }

  renderLoading() {
    const { isLoading } = this.state;
    if (!isLoading) {
      return null;
    }
    return <div className="center">Loading...</div>;
  }

  renderNoResults() {
    const { results } = this.state;
    if (!isEmpty(results)) {
      return null;
    }
    return <div className="center">No results found.</div>;
  }

  renderResults() {
    const { results } = this.state;
    return (
      <div className="results">
        {results.map(r => (
          <SearchResult key={r.id} result={r} />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div id="searchResults">
        {this.renderLoading() ||
          this.renderError() ||
          this.renderNoResults() ||
          this.renderResults()}
      </div>
    );
  }
}

export default withRouter(SearchPage);
