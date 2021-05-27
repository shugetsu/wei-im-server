import { TypegooseModule } from 'nestjs-typegoose';
import { MongoConfig } from 'src/config/mongo.config';

export const MongoModule = TypegooseModule.forRoot(
  `${MongoConfig.uri}:${MongoConfig.port}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: MongoConfig.dbName,
  },
);
