import React from 'react';

interface Props<T> {
  children: (item: T, index: number) => JSX.Element;
  className?: string;
  items: T[] | null;
}

function wrapItem(element: JSX.Element, index: number) {
  return <li key={index}>{element}</li>;
}

function List<T>(props: Props<T>) {
  const { children: fn, className, items } = props;
  return (
    <ul className={className}>
      {items &&
        items
          .filter(i => Boolean(i))
          .map(fn)
          .map(wrapItem)}
    </ul>
  );
}

export default List;
