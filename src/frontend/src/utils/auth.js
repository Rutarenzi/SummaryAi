import { AuthClient } from "@dfinity/auth-client";

const MAX_TTL = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
//check the value of this identity
const IDENTITY_PROVIDER = `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8000#authorize`;


export const getAuthClient=async()=>{
    return await AuthClient.create();
}

export const login=async()=>{
  const authClient = window.auth.client;

  const isAuthenticated = await authClient.isAuthenticated();

  if(!isAuthenticated){
    await authClient?.login({
        maxTimeToLive: MAX_TTL,
        identityProvider: IDENTITY_PROVIDER,
        onSuccess: async()=>{
            window.auth.isAuthenticated = await authClient.isAuthenticated();
            window.location.reload();
        },
    });
  }
}

export const logout=async()=>{   
    const authClient = window.auth.client;
    authClient.logout();
    window.location.reload();

}
