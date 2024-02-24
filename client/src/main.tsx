import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'


const APS_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJFa2dpRTRiSlZYcnp6QWVBdzliR2N3UDB3T1VVa3VHViIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJ5OVpzVWJmdko3S1VvT2JFTGxXTkdDaEdTRzlRQnhRM1RtdThrOFl2YnRyMHEwZjF0VnVYMFdDd0NCQ0xoNGkzIiwiZXhwIjoxNzA4NjU2NzE2fQ.jdCRxRwCVd3wjhSXvHY30Dy9jRTBnCuRoO88j3H08_3HYZRqhbtoHBoX1t1YSdRZx7CgCKyAIv6RR5dUhHlKZqkzHrv30zsKdH4xSfItaH6NNGz_JxV30Uv3D_e2MNggZpiFjuCqgqB9m6Yu8TgrHeA2afmGX_0Jo_FcC4UsOkIWGJPPOUUmINwUTVfX0G3FtIHdzqmsGWK1_wAyAixfqs3ubKpohaUwvOFfINK_gxJlpi5DPzPZ_XReO2M2NR-MV32tQLP5otgN7qxSrseiMXr9is1BFTjbLSpymgMR6c0taCcd6nGh3BDbTdGEtXQSACD_LFvZ-61p5zaczYOF7A'; // Specify your access token
const APS_MODEL_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtY29kZXBlbi1tb2RlbHMvcmFjLWFkdmFuY2VkLXNhbXBsZS1wcm9qZWN0LnJ2dA'; // Specify your model URN

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (!APS_ACCESS_TOKEN || !APS_MODEL_URN) {
    root.render(
      <div>Please specify <code>APS_ACCESS_TOKEN</code> and <code>APS_MODEL_URN</code> in the source code.</div>
    );
} else {
    root.render(
      <React.StrictMode>
        <App token={APS_ACCESS_TOKEN} urn={APS_MODEL_URN} />
      </React.StrictMode>,
    );
}

