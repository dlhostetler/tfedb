import React from 'react';
import * as entity from '../../../../../types/entity';
import List from '../../../../layout/List';

interface Props {
  className?: string;
  object: entity.Object;
}

function Description(props: { description: entity.Description }) {
  const { description } = props;
  return (
    <div className="description">
      <div className="keywords">{description.keywords}</div>
      <div className="description">{description.description}</div>
    </div>
  );
}

function Descriptions(props: Props) {
  const { object } = props;
  return (
    <List<entity.Description> items={object.descriptions}>
      {description => {
        return <Description description={description} />;
      }}
    </List>
  );
}

export default Descriptions;
