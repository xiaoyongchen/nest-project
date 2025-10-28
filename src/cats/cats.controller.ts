import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
 
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
 
  @Post()
  create(@Body() cat: string): void {
    this.catsService.create(cat);
  }
 
  @Get()
  findAll(): string[] {
    return this.catsService.findAll();
  }
}