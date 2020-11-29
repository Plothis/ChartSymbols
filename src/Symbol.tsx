import * as React from 'react';

export interface ISymbolProps {
  alt: string;
  svg: string;
}

export const SymbolImg = (props: ISymbolProps) => {
  const { alt, svg } = props;

  return <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt={alt} />;
};
