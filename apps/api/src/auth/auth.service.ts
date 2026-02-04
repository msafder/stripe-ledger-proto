import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export type AuthInput = { username: string; password: string;};
export type SignInData = { userId: number; username: string;};
export type AuthResult = {accestoken: string; userId: number; username: string;}; 

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    
    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if(!user) {
            throw new UnauthorizedException();
        }

        return {
            accestoken: 'fake-access',
            userId: user.userId,
            username: user.username
         }
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findUserByName(input.username);

        if(user && user.password === input.password) {
            return { 
                userId: user.userId, 
                username: user.username 
            };
        }   

        return null;
    }
}
