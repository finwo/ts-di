import { AbstractConstructable } from './abstract-constructable.type';
import { Constructable         } from './constructable.type';

export type Identifier<T = unknown> =
  | AbstractConstructable<T>
  | Constructable<T>
  | symbol
  | string;
