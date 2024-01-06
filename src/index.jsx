import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Specify your access token
const APS_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJFa2dpRTRiSlZYcnp6QWVBdzliR2N3UDB3T1VVa3VHViIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJBVXVzZEtmcGJIUTg1MHdNTmUwQ0d1d3dyV2ZvV2dRR09Nd2NIR2Q5RGpvTUZsVFRGaEVSZGRDeHJObFRLNkNpIiwiZXhwIjoxNzA0NTMyMDg1fQ.UVDiMO3OimcOMOVpUBrqzMAq02UC4nDl0x3ll9MIjcBt_8RL9BGo9MzTlgPC08w-3U0YHeUtQj75s130N4Wdu1MwK9auYVSeMcmY5SI_CZe2OOFO0z9sOHgKBB_aYLQeteGeMsmu2ouWM87xoGMIkBMZQoZLzWpHVyEJIeFsZPnX7xzGmYqfBP_8r_8gWwta_6G5dV45KK-x_UqhLrTUZ32hbCb4eBId9BnHT3vbNL6cze5dwWiTwef27-Sz81LMTbTJwV3VkJDwubjdOkjPUHw15QDkXpJHeDpiujDsXuNO_s0Y_owZ8amzyxkqTl1zMYiXMoBFXDhubdFQlPc8iA'; 
// Specify your model URN
const APS_MODEL_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtY29kZXBlbi1tb2RlbHMvcmFjLWFkdmFuY2VkLXNhbXBsZS1wcm9qZWN0LnJ2dA'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!APS_ACCESS_TOKEN || !APS_MODEL_URN) {
    root.render(<div>Please specify <code>APS_ACCESS_TOKEN</code> and <code>APS_MODEL_URN</code> in the source code.</div>);
} else {
    root.render(<App token={APS_ACCESS_TOKEN} urn={APS_MODEL_URN} />);
}
