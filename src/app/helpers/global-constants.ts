// export class GlobalConstants {
// }
import {AuthConfig} from 'angular-oauth2-oidc';

export const API:string = 'http://kinbo.tv:8080';
export const CURRENT_USER:string = 'kinbo-user';
export const CLIEND_ID:string = 'web-client';
export const CLIENT_SECRET:string = 'AfWg7rtkZ7yMyxtw';
export const OAUTH_CONFIG : AuthConfig = {
  clientId : CLIEND_ID,
  dummyClientSecret : CLIENT_SECRET,
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'read write trust',
  // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
  // OAuth2-based access_token
  oidc: false, // ID_Token
  tokenEndpoint: API + '/oauth/token',
  requireHttps: false,
  userinfoEndpoint: API + '/api/agents/authenticated'
};

// export const WOWZA_CLOUD_API_KEY: string = 'T8KCG2kbcgDQs0zQfR2aDCH5HCYrIYsrqwQDjR0H04YgLDdxjwEwsAZGh0FJ322c';
// export const WOWZA_CLOUD_ACCESS_KEY: string = '2CZwf4dQOG1dSLKojKYdXSK93Sig7tYo4kGJjc5SapcZwAbjfJCbM5cGRkf13303';
export const WOWZA_CLOUD_API_KEY: string = 'NVTvFc5I4fJzjtSfOYuAw6n66hJS7rPyRymWgVZDWR0mxk4S0h2cK38rJQLQ3321';
export const WOWZA_CLOUD_ACCESS_KEY: string = 'demvj0cEmvxq7JJxAK6jPuaiIv6BRTqpgQKwZHmuVev3LgRgK3FBPXCkZIuT3558';
export const WOWZA_CLOUD_HOST: string = 'https://api.cloud.wowza.com/api/v1.6/';
