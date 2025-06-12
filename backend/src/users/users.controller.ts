import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    // Un administrateur crée un utilisateur basic pour sa copropriété
    const adminCoproId = req.user.coproprieteId;
    return this.usersService.create({
      ...createUserDto,
      coproprieteId: adminCoproId,
    });
  }

  @Get()
  findAll(@Request() req) {
    const adminCoproId = req.user.coproprieteId;
    return this.usersService.findAll(adminCoproId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    const adminCoproId = req.user.coproprieteId;
    return this.usersService.findOne(id, adminCoproId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const adminCoproId = req.user.coproprieteId;
    return this.usersService.update(id, updateUserDto, adminCoproId);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    const adminCoproId = req.user.coproprieteId;
    return this.usersService.remove(id, adminCoproId);
  }
}
