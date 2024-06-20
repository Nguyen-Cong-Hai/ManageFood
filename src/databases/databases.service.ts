import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/constants/enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userService: UsersService,

    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');

    if (Boolean(isInit)) {
      const countUser = await this.userRepository.count({});

      if (countUser === 0) {
        await this.userRepository.save([
          {
            name: 'Owner',
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            role: Role.Owner,
          },
          {
            name: 'Employee',
            email: 'employee@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            role: Role.Employee,
          },
        ]);
      }

      if (countUser > 0) {
        this.logger.log('>>> ALREADY INITIALIZED SAMPLE DATA...');
      }
    }
  }
}
