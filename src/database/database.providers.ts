import { ConfigService } from '@nestjs/config';
import { __prod__ } from '../constants';
import { createConnection } from 'typeorm';
// import { config } from 'dotenv-safe';

// config();

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return await createConnection({
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URL')!,
        logging: !__prod__,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }).catch((err) => console.log(err));
    },
  },
];
