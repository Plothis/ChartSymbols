import * as React from 'react';

import { SymbolImg, treemap } from '../src';

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  public render() {
    const { svgCode, name } = treemap;
    return (
      <div className="symbol-img-container">
        <SymbolImg alt={name} svg={svgCode} />
      </div>
    );
  }
}

export default App;
