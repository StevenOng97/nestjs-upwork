import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { Provider } from '@prisma/client';
import { User } from 'src/interfaces/user.interface';
import { CustomException } from 'src/base/exceptions/custom-exceptions';
import { ErrorCode } from 'src/base/enums/error-codes.enum';
import { CustomLogger } from 'src/logger/custom-logger';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: CustomLogger,
  ) {
    this.logger.setContext('AuthService');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.data.password))) {
      const { password, ...result } = user.data;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: { email: string; password: string }) {
    try {
      const user = await this.usersService.findByEmail(signupDto.email);

      if (user) {
        this.logger.error('User already exists', 'signup');
        throw new CustomException(
          ErrorCode.EMAIL_ALREADY_EXISTS,
          400,
          'Email already exists',
        );
      }

      const encryptedPassword = await bcrypt.hash(signupDto.password, 10);
      const createdUser = await this.usersService.create({
        email: signupDto.email,
        password: encryptedPassword,
        provider: Provider.EMAIL,
      });
      return createdUser;
    } catch (err) {
      this.logger.error('Error creating user', err.message);
      throw err;
    }
  }

  async googleLogin(req) {
    try {
      if (!req.user) {
        throw new CustomException(
          ErrorCode.GOOGLE_AUTHENTICATION_FAILED,
          400,
          'Invalid Google authentication'
        );
      }
  
      const user = await this.usersService.findByEmail(req.user.email);
      let loginUser: User;
  
      if (!user.data) {
        const createdUser = await this.usersService.create({
          email: req.user.email,
          provider: Provider.GOOGLE,
        });
        loginUser = createdUser.data;
      } else {
        loginUser = user.data;
      }
      const token = await this.login(loginUser);
      return {
        success: true,
        message: 'Google login successful',
        data: { user: loginUser, ...token }
      };
    } catch (err) {
      this.logger.error('Error logging with Google', err.message);
      return {
        success: false,
        message: err.message || 'Error logging with Google',
        error: err.code || ErrorCode.GOOGLE_LOGIN_FAILED
      };
    }
  }
}
