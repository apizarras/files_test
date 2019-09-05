import React from 'react';
import './App.css';
import FileApiView from './components/FileApiView';

export const App = props => {
  const { connection } = props;

  if (!connection) return null;

  return (<FileApiView connection={connection} />);

}

export default App;
