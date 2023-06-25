export class User {
  constructor(
    public fullname: string,
    public email: string,
    public interlocutors?: User[],
    public img?: string,
    public key?: string
  ) {}
}

export class SigninModel {
  constructor(private username: any, private password: any) {}
}

export class SignupModel {
  constructor(
    private email: any,
    private password: any,
    private fullname: any
  ) {}
}
