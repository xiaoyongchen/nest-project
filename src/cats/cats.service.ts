import { Injectable } from '@nestjs/common';
 
@Injectable()
export class CatsService {
  private readonly cats: string[] = [];
 
  create(cat: string): void {
    this.cats.push(cat);
  }
 
  findAll(): string[] {
    return this.cats;
  }
}