import {
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SalesReport {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_name: string;

  @Column({ type: 'int' })
  age: number;

  @Column()
  height: number;

  @Column()
  sale_amount: number;

  @Column()
  last_purchase_date: Date;

  @CreateDateColumn()
  created_at: Date;
}
