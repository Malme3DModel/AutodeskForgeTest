import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Specify your access token
const APS_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJidWNrZXQ6Y3JlYXRlIiwiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSJdLCJjbGllbnRfaWQiOiJsU3pZNmFWNENhaDk1RmJWN2M2R1dnSWhoRzhvTjhsaiIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiI3VFdyNlpOeTV2a1QzaHJWOHU0VEVuNWk0QzdMVFNoTTNhbGl4aTlxMm14eFZySjJueFFCNDQ5cUdZc1F6NlB3IiwiZXhwIjoxNzA0NTI4NTM3fQ.cu7hRPdU8B8i-joi3pbaKzTUtQCrVN76_yM4BswyD2Pzocwx4tDfSjLEro8alPsYJuuFC0isXzD-bw-hiB99fjoI36GLvVg7QjK93y0tOEBomOXS5XULeClSoRMb4Peb5ktUNc-cXZpX6vnGWGj8O4F2T1S8mxEgySGgDGN3sA1OHOknIhzaVmIVEw4jQxSyBOQh14s7AxpBxU4zHwP-W-614PKj0FHGnqPIEe198F3a0JAdb_wHJux7cm2xDSFsLJ91igITMIkNgL-a3MrM2fca8u6BAuvwtSwS3_YOSVjleUufPb50egGyrLbqiXj-yvGxhNvFI5A9h7ZrTRjU0Q'; 
// Specify your model URN
const APS_MODEL_URN = 'https://developer.api.autodesk.com/oss/v2/buckets/my_server_side_app_bucket/objects/Clinic_Electrical.ifc'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!APS_ACCESS_TOKEN || !APS_MODEL_URN) {
    root.render(<div>Please specify <code>APS_ACCESS_TOKEN</code> and <code>APS_MODEL_URN</code> in the source code.</div>);
} else {
    root.render(<App token={APS_ACCESS_TOKEN} urn={APS_MODEL_URN} />);
}
