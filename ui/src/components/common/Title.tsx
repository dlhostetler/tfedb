import React from 'react';
import { isArray } from 'lodash';
import { Helmet } from 'react-helmet';

const MAX_CHARS = 20;

interface Props {
  text: string | string[];
}

function truncate(s: string) {
  if (s.length > MAX_CHARS) {
    return s.substr(0, MAX_CHARS) + '...';
  }
  return s;
}

export function Title(props: Props) {
  let { text } = props;
  if (isArray(text)) {
    text = text.map(truncate).join(' | ');
  }
  return (
    <Helmet>
      <title>{`${text} - tfedb`}</title>
    </Helmet>
  );
}
