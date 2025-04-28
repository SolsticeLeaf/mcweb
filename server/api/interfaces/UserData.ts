export default interface UserData {
  userId: string;
  username: string;
  avatar: string;
  email: string;
  emailStatus: 'VERIFIED' | 'NOT_VERIFIED';
  permissions: Array<string>;
}
