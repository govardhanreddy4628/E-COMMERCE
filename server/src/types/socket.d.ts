import "socket.io";
import type { IUserDocument } from "../models/userModel";

declare module "socket.io" {
  interface Socket {
    user?: IUserDocument;
  }
}
