import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hassPassword: string) {
    return compareSync(password, hassPassword);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findUserByToken(refreshToken: string) {
    return await this.userRepository.findOne({
      where: {
        refreshToken,
      },
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        email: username,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateUserRefreshToken(refreshToken: string, id: number) {
    return await this.userRepository.update(
      { id },
      {
        refreshToken,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
