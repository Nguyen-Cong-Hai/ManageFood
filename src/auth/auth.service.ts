import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (user) {
      const isValid = this.userService.isValidPassword(pass, user.password);

      if (isValid === true) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser) {
    const { id, name, email, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      data: {
        id,
        name,
        email,
        role,
      },
    };
  }
}
