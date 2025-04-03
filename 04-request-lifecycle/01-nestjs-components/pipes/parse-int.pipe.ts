import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const numValue = parseInt(value, 10);

    if (Number.isNaN(numValue)) {
      throw new BadRequestException(`"${value}" не является числом`);
    }

    return numValue;
  }
}
