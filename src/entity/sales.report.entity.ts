import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalesReportDocument = SalesReport & Document;

@Schema()
export class SalesReport {
  @Prop({ required: true })
  USER_NAME: string;

  @Prop({ validate: { validator: Number.isInteger }, required: true })
  AGE: number;

  @Prop({ required: true })
  HEIGHT: number;

  @Prop({ required: true })
  SALE_AMOUNT: number;

  @Prop({ required: true })
  LAST_PURCHASE_DATE: Date;
}

export const SalesReportSchema = SchemaFactory.createForClass(SalesReport);
