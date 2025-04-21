import { UserValues } from "../db/generated/prisma";
declare global{
    namespace Express{
        interface User extends UserValues{}
         //We extend user from uservalues so that whenever we reference passport.user we go straight to here
        //Explicit declaration down later
        interface Request {
            login(user: UserValues, done: (err?: any) => void): void;
            logIn(user: UserValues, done: (err?: any) => void): void;
            logout(done: (err?: any) => void): void;
            logOut(done: (err?: any) => void): void;
            user?: UserValues; //Right here
        }
        interface Response{
            customStatus(code: number, message: string): this; //Define our customstatus which will be used elsewhere
        }
    }
}