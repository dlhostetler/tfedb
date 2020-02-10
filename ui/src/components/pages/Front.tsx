import React from 'react';
import SearchInput from '../search/Input';

const Front: React.FunctionComponent = () => {
  return (
    <div className="front">
      <div className="search center">
        <SearchInput autoFocus={true} />
      </div>
    </div>
  );
};

export default Front;
