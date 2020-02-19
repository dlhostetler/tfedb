import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SearchInput from '../search/Input';
import { Title } from '../common/Title';

type Props = RouteComponentProps;

class Front extends React.Component<Props> {
  onSearch = (text: string) => {
    const { history } = this.props;
    history.push(`/search?q=${text}`);
  };

  render() {
    return (
      <div className="front">
        <Title text="Home" />
        <div className="search center">
          <SearchInput autoFocus={true} onSearch={this.onSearch} />
        </div>
      </div>
    );
  }
}

export default withRouter(Front);
