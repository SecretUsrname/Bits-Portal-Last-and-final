import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Use environment variable for client ID
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleOauth = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log('Success:', credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleOauth;
