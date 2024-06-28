export default {
  meEndpoint: 'http://localhost:3001/auth',
  loginEndpoint: 'http://localhost:3001/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
