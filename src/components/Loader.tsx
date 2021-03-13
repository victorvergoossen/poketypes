import React from 'react';

export const Loader = ({ absolute = false }: { absolute?: boolean }): JSX.Element => (
  <div className={`loader ${absolute ? 'loader-absolute' : ''}`}>
    <div /><div />
  </div>
);

export default Loader;
