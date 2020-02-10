import React from 'react';

interface EntityLinkProps {
  className: string;
  id: string;
  type: string;
}

function entityUrl(type: string, id: string) {
  return `/${type}/${id}`;
}

const EntityLink: React.FunctionComponent<EntityLinkProps> = props => {
  const { children, className, id, type } = props;
  return (
    <a className={className} href={entityUrl(type, id)}>
      {children}
    </a>
  );
};

export default EntityLink;
