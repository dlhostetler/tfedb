import React from 'react';
import { Link } from 'react-router-dom';

interface EntityLinkProps {
  className?: string;
  id: string;
  type: string;
}

function entityUrl(type: string, id: string) {
  return `/${type}/${id}`;
}

const EntityLink: React.FunctionComponent<EntityLinkProps> = props => {
  const { children, className, id, type } = props;
  return (
    <Link className={className} to={entityUrl(type, id)}>
      {children}
    </Link>
  );
};

export default EntityLink;
