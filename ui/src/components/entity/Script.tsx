import React from 'react';
import classnames from 'classnames';
import * as entity from '../../types/entity';
import List from '../layout/List';

interface DescriptionProps {
  description: entity.ScriptDescription;
}

function Description(props: DescriptionProps) {
  const { description } = props;
  return (
    <div className="description">
      <div className="placeholder">{description.placeholder}</div>
      <div className="value">{description.value}</div>
    </div>
  );
}

interface Props {
  className?: string;
  script: entity.Script;
}

const Script: React.FunctionComponent<Props> = props => {
  const { className, script } = props;
  return (
    <div className={classnames('script', className)}>
      {script.type && <div className="type">{script.type}</div>}
      <pre className="code">{script.code}</pre>
      <List<entity.ScriptDescription>
        className="pois"
        items={script.descriptions}
      >
        {description => {
          return <Description description={description} />;
        }}
      </List>
    </div>
  );
};

export default Script;
