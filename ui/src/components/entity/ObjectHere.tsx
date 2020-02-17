import React from 'react';
import classnames from 'classnames';
import * as entity from '../../types/entity';
import EntityLink from '../links/EntityLink';
import { prefixWithArticle } from '../../format/here';

interface Props {
  className?: string;
  link?: boolean;
  liquid?: entity.Liquid | null;
  object: entity.Object;
  plural?: boolean;
}

function Prefix(props: Props) {
  const { object, plural } = props;
  let prefix = object.herePrefix;
  if (plural) {
    prefix = object.herePluralPrefix;
  }
  return (
    <span className="prefix">
      {prefixWithArticle(prefix, Boolean(plural), object.name)}
    </span>
  );
}

function Link(props: Props) {
  const { link, object, plural } = props;
  let name = object.name;
  if (plural) {
    name = object.namePlural;
  }
  if (!link) {
    return <span className="name">{name}</span>;
  }
  return (
    <EntityLink className="name" id={object.id} type="object">
      {name}
    </EntityLink>
  );
}

function Liquid(props: Props) {
  const { liquid, object } = props;
  // TODO: it'd be better if the liquid was just empty when not appropriate
  if (object.subtype !== 'drink_container' || !liquid) {
    return null;
  }
  return <span className="liquid">{`filled with ${liquid.name}`}</span>;
}

function Locked(props: Props) {
  const { object } = props;
  if (!object.key) {
    return null;
  }
  return (
    <span className="locked">
      <span className="blurb">locked by</span>
      <EntityLink id={object.key.id} type="object">
        {`a ${object.key.name}`}
      </EntityLink>
    </span>
  );
}

function Suffix(props: Props) {
  const { object, plural } = props;
  let suffix = object.hereSuffix;
  if (plural) {
    suffix = object.herePluralSuffix;
  }
  return <span className="suffix">{suffix}</span>;
}

function ObjectHere(props: Props) {
  const { className } = props;
  return (
    <div className={classnames('here', className)}>
      <Prefix {...props} />
      <Link {...props} />
      <Liquid {...props} />
      <Locked {...props} />
      <Suffix {...props} />
    </div>
  );
}

export default ObjectHere;
