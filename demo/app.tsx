import * as React from 'react';

import { Treemap } from '../src';

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  public render() {
    return (
      <div>
        <img src={Treemap} alt={'treemap'} />
      </div>
    );
  }
}

export default App;
