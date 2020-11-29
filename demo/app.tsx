import * as React from 'react';

import { SymbolImg, Treemap } from '../src';

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  public render() {
    const { svgCode, name } = Treemap;
    return (
      <div>
        <SymbolImg alt={name} svg={svgCode} />
      </div>
    );
  }
}

export default App;
