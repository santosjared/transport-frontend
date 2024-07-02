import getConfig from 'src/configs/environment'
export default {
  meEndpoint: `${getConfig().backendURI}/auth`,//'http://localhost:3001/auth',
  loginEndpoint: `${getConfig().backendURI}/auth/login`,//'http://localhost:3001/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
