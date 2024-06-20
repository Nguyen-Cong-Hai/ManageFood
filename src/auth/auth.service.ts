import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async login(user: IUser, response: Response) {
    const { id, name, email, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    //update user with refresh token
    await this.userService.updateUserRefreshToken(refresh_token, id);

    //set refresh token in cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        name,
        email,
        role,
      },
    };
  }

  createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  }

  async processNewToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.userService.findUserByToken(refreshToken);

      if (user) {
        const { id, name, email, role } = user;

        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          id,
          name,
          email,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.userService.updateUserRefreshToken(refresh_token, id);

        //clear old refresh token
        response.clearCookie('refresh_token');

        //set refresh token in cookie
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException('Refresh token is invalid. Please login');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token is invalid. Please login');
    }
  }

  async logout(response: Response, user: IUser) {
    await this.userService.updateUserRefreshToken('', user.id);
    response.clearCookie('refresh_token');
    return 'oke';
  }
}
