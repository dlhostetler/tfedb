import React from 'react';
import * as entity from '../../../../../types/entity';
import TitledBorder from '../../../../layout/TitledBorder';
import List from '../../../../layout/List';
import Flag from './Flag';
import Affect from './Affect';

interface Props {
  className?: string;
  object: entity.Object;
}

function SpecialInfo(props: Props) {
  const { object } = props;
  return (
    <TitledBorder title="Special">
      <List<string> items={object.flags}>
        {flag => {
          return <Flag flag={flag} />;
        }}
      </List>
      <List<entity.Affect> items={object.affects}>
        {affect => {
          return <Affect affect={affect} />;
        }}
      </List>
    </TitledBorder>
  );
}

export default SpecialInfo;
