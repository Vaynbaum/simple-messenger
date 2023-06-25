import { Message } from './message.model';
import { User } from './user.model';
export class Dialog {
  constructor(public interlocutor: User, public message: Message) {}
}
