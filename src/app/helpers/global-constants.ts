// export class GlobalConstants {
// }
import {AuthConfig} from 'angular-oauth2-oidc';

export const API:string = 'http://ec2-54-237-61-205.compute-1.amazonaws.com:8080';
export const CURRENT_USER:string = 'kinbo-user';
export const CLIEND_ID:string = 'web-client';
export const CLIENT_SECRET:string = 'AfWg7rtkZ7yMyxtw';
export const OAUTH_CONFIG : AuthConfig = {
  clientId : CLIEND_ID,
  dummyClientSecret : CLIENT_SECRET,
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope:"read write trust",
  // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
  // OAuth2-based access_token
  oidc :false, // ID_Token
  tokenEndpoint : API+'/oauth/token',
  requireHttps : false,
  userinfoEndpoint : API+'/api/agents/authenticated'

};
