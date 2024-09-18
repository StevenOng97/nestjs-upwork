import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CustomLogger } from 'src/logger/custom-logger';
import { CustomException } from 'src/base/exceptions/custom-exceptions';
import { ErrorCode } from 'src/base/enums/error-codes.enum';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: CustomLogger,
    private configService: ConfigService,
  ) {
    this.logger.setContext('AuthController');
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    loginDto.email = loginDto.email.toLowerCase().trim();
    loginDto.password = loginDto.password.trim();

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      this.logger.error('Invalid email or password', 'loginDto');
      throw new CustomException(
        ErrorCode.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
        'Bad Request',
      );
    }

    return this.authService.login(user);
  }

  @Post('sign-up')
  async signup(@Body() signupDto: { email: string; password: string }) {
    signupDto.email = signupDto.email.toLowerCase().trim();
    signupDto.password = signupDto.password.trim();
    return this.authService.signup(signupDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = await this.authService.googleLogin(req);
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    return res.redirect(`${clientUrl}?token=${token.data.access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
