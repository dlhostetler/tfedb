import React from 'react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import * as entity from '../../../../../types/entity';

interface Props {
  className?: string;
  attributes: entity.Attribute[];
}

function shortAttribute(attribute: entity.Attribute) {
  const { type, value } = attribute;
  return `${type.substr(0, 3)} ${value}`;
}

function prettyAttributes(attributes: entity.Attribute[]) {
  return attributes.map(shortAttribute).join(' ');
}

function Attributes(props: Props) {
  const { attributes, className } = props;
  if (isEmpty(attributes)) {
    return null;
  }
  return (
    <div className={classnames('attributes', className)}>
      {prettyAttributes(attributes)}
    </div>
  );
}

export default Attributes;
