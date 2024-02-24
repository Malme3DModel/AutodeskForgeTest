import { useState } from 'react'
import Viewer from './Viewer';
import './App.css';

export default function App(props: { token: string;  urn: string; }) {

  return (
    <div className="app">
      <div style={{ position: 'relative', width: '800px', height: '600px' }}>
        <Viewer
          runtime={{ accessToken: props.token }}
          urn={props.urn}
        />
      </div>
    </div>
  );
}
