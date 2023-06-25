export class Message {
  constructor(
    public interlocutors: string[],
    public text: string,
    public is_last: boolean,
    public created?: Date,
    public sender?: string,
    public key?: string
  ) {}
}
export class InputMessage {
  constructor(public text: string, public recipient: string) {}
}
