import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SearchInput from '../../search/Input';
import qs from 'qs';

type Props = RouteComponentProps;

class Header extends React.Component<Props> {
  query() {
    const { location } = this.props;
    if (location.pathname !== '/search') {
      return;
    }
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    return params.q;
  }

  onSearch = (text: string) => {
    const { history } = this.props;
    history.push(`/search?q=${text}`);
  };

  render() {
    return (
      <div id="header">
        <div className="right">
          <SearchInput query={this.query()} onSearch={this.onSearch} />
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
