/// import * as Autodesk from "@types/forge-viewer";

import React from 'react';

import { ForgeViewer } from  '@contecht/react-adsk-forge-viewer';


export default function Viewer(props: {runtime:{ accessToken: string; }; urn: string;}) {

  const  token = props.runtime.accessToken;
  const  urn = props.urn; 

  return (
    <ForgeViewer  {...{token, urn}}/>
  );
}
