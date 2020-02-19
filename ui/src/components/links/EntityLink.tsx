import React from 'react';
import { Link } from 'react-router-dom';

interface EntityLinkProps {
  className?: string;
  id: string;
  onClick?: () => void;
  type: string;
}

function entityUrl(type: string, id: string) {
  return `/${type}/${id}`;
}

const EntityLink: React.FunctionComponent<EntityLinkProps> = props => {
  const { children, className, id, onClick, type } = props;
  return (
    <Link className={className} onClick={onClick} to={entityUrl(type, id)}>
      {children}
    </Link>
  );
};

export default EntityLink;
