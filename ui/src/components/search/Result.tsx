import React from 'react';
import classnames from 'classnames';
import { map } from 'lodash';
import { SearchResult } from './types';
import EntityLink from '../links/EntityLink';
import Match from './Match';

interface Props {
  className?: string;
  result: SearchResult;
}

const Result: React.FunctionComponent<Props> = props => {
  const { className, result } = props;
  return (
    <div className={classnames('result', className)}>
      <EntityLink className="name" id={result.id} type={result.type}>
        {result.fields.name || result.fields.appearance}
      </EntityLink>
      <div className="type">{result.type}</div>
      <div className="matches">
        {map(result.matches, (v, k) => {
          return <Match field={k} key={k} value={v} />;
        })}
      </div>
    </div>
  );
};

export default Result;
