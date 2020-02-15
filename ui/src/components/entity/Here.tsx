import React from 'react';
import classnames from 'classnames';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  id?: string;
  includePrefix: boolean;
  link: boolean;
  name: string;
  plural: boolean;
  prefix: string;
  suffix: string;
  type?: string;
}

function withArticle(prefix: string | null, plural: boolean, name: string) {
  const s = prefix || name;
  if (prefix) {
    prefix = ` ${prefix}`;
  } else {
    prefix = '';
  }
  if (plural) {
    return `Some${prefix}`;
  }
  const firstChar = s.substr(0, 1);
  if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
    return `An${prefix}`;
  }
  return `A${prefix}`;
}

function Prefix(props: Props) {
  const { includePrefix, name, plural, prefix } = props;
  if (!includePrefix) {
    return null;
  }
  return <span className="prefix">{withArticle(prefix, plural, name)}</span>;
}

function Link(props: Props) {
  const { id, link, name, type } = props;
  if (!link) {
    return <span className="name">{name}</span>;
  }
  if (!id || !type) {
    throw new Error('When link=true, must pass id and type.');
  }
  return (
    <EntityLink className="name" id={id} type={type}>
      {name}
    </EntityLink>
  );
}

function Here(props: Props) {
  const { className, suffix } = props;
  return (
    <div className={classnames('here', className)}>
      <Prefix {...props} />
      <Link {...props} />
      <span className="suffix">{suffix}</span>
    </div>
  );
}

export default Here;
