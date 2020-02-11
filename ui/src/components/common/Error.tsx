import React from 'react';

interface Props {
  error: any;
}

const Error: React.FunctionComponent<Props> = props => {
  const { error } = props;
  return <div>{error.toString()}</div>;
};

export default Error;
