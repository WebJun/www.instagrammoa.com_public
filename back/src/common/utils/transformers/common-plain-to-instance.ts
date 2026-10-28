import { Logger } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * @augment_1 class
 * @augment_2 plain
 * @return plainToInstance(class, plain, { excludeExtraneousValues: true, enableImplicitConversion: true })
 */
export function commonPlainToInstance<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
): T {
  // Logger.debug(`${cls.name}`, commonPlainToInstance.name);
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
