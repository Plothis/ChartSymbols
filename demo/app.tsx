import * as React from 'react';

import { ChartSymbols, SymbolImg } from '../src';

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  public render() {
    return (
      <div className="symbols">
        {Object.keys(ChartSymbols).map(chart => {
          const { svgCode, name } = ChartSymbols[chart];
          return (
            <div className="symbol-img-container">
              <SymbolImg alt={name} svg={svgCode} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
