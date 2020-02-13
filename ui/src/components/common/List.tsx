import React from 'react';

interface Props<T> {
  children: (item: T, index: number) => JSX.Element;
  className?: string;
  items: T[] | null;
}

function List<T>(props: Props<T>) {
  const { children: fn, className, items } = props;
  return <div className={className}>{items && items.map(fn)}</div>;
}

export default List;
