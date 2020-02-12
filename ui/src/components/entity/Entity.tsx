import React from 'react';
import classnames from 'classnames';
import Error from '../common/Error';

interface Props {
  className?: string;
  error: any;
  isLoading: boolean;
}

const Entity: React.FunctionComponent<Props> = props => {
  const { children, className, error, isLoading } = props;
  if (isLoading) {
    return <div className={'center'}>Loading...</div>;
  }
  if (error) {
    return <Error error={error} />;
  }
  return <div className={classnames('entity', className)}>{children}</div>;
};

export default Entity;
