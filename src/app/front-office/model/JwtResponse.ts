export class JwtResponse {
  token: string;
  type: string = 'Bearer';
  id: number;
  username: string;
  email: string;
  roles: string[];
  phone: number;
  isVerified: number;

  constructor(
    token: string,
    id: number,
    username: string,
    email: string,
    roles: string[],
    isVerified: number,
    phone: number
  ) {
    this.token = token;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.isVerified = isVerified;
    this.phone = phone;
  }
}
