
export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  // Assuming Role is another interface or type
}

export class User implements IUser {
  constructor(
    public username: string,
    public email: string,
    public twoFactorSecret: string,
    public password: string,
    public id?: number,
    public isVerified?: number,
    public phone?: number,



  ) {}
}
