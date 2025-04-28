export default interface Token {
  accessToken: string;
  refreshToken: string;
  accessExpire: Date;
  refreshExpire: Date;
}
