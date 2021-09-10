import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalesReportDocument = SalesReport & Document;

@Schema()
export class SalesReport {
  @Prop()
  user_name: string;

  @Prop()
  age: number;

  @Prop()
  height: number;

  @Prop()
  sale_amount: number;

  @Prop()
  last_purchase_date: Date;
}

export const SalesReportSchema = SchemaFactory.createForClass(SalesReport);
