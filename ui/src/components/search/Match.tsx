import React from 'react';
import classnames from 'classnames';
import { first } from 'lodash';

const preHighlight = '<em>';
const postHighlight = '</em>';
const highlightRegex = /(<em>.+?<\/em>)/g;

interface HighlightProps {
  value: string;
}

const Highlight: React.FunctionComponent<HighlightProps> = props => {
  const { value } = props;
  const m = highlightRegex.exec(value);
  if (m) {
    let highlighted = m[1];
    highlighted = highlighted.slice(preHighlight.length);
    highlighted = highlighted.slice(
      0,
      highlighted.length - postHighlight.length
    );
    return <span className="highlight">{highlighted}</span>;
  }
  return <span>{value}</span>;
};

interface MatchProps {
  className?: string;
  field: string;
  value: string[];
}

const Match: React.FunctionComponent<MatchProps> = props => {
  const { className, field, value } = props;
  const s = first(value) as string;
  if (!s) {
    return null;
  }
  const values = s.split(highlightRegex);
  return (
    <div className={classnames('match', className)}>
      <div className="field">{field}</div>
      <div className="value">
        {values.map((h, i) => (
          <Highlight key={i} value={h} />
        ))}
      </div>
    </div>
  );
};

export default Match;
