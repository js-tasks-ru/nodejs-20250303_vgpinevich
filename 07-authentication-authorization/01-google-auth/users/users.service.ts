import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      delete user.password;
    }

    return user;
  }

  create(payload: Partial<User>) {
    return this.userRepository.save(payload);
  }
}
