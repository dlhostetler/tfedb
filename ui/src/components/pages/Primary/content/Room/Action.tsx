import React from 'react';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';
import { Script } from '../../../../entity';

interface Props {
  action: entity.Action;
  className?: string;
}

function trigger(action: entity.Action) {
  if (action.trigger === 'none') {
    return null;
  }
  return (
    <div className="trigger">
      <label>Trigger:</label>
      <span className="value">{action.trigger}</span>
    </div>
  );
}

function interaction(action: entity.Action) {
  return (
    <>
      <div className="verbs">
        <label>Verbs:</label>
        <span className="value">{action.verbs}</span>
      </div>
      <div className="targets">
        <label>Targets:</label>
        <span className="value">{action.targets}</span>
      </div>
    </>
  );
}

function Action(props: Props) {
  const { action, className } = props;
  return (
    <div className={classnames('action', className)}>
      {trigger(action) || interaction(action)}
      <Script script={action.script} />
    </div>
  );
}

export default Action;
