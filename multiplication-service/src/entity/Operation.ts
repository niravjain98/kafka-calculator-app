import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operand: string;

  @Column()
  result: number;
}
