import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm'

const DEFAULT_PSQL_HOST = 'localhost'
const DEFAULT_PSQL_PORT = 5432

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const database = configService.get<string>('PSQL_DATABASE')

        if (database === undefined) {
            throw new Error(
                "Environment variable 'PSQL_DATABASE' cannot be undefined",
            )
        }

        // synchronize definition

        let synch = true;
        let mode = configService.get<string>('NODE_ENV');
        if (mode != 'development_no_migration') synch = false;

        // dropped DB definition

        let drop = false;
        if (synch) drop = Boolean(+ConfigService.get('DROP_DATABASE'));

        return {
            type: 'postgres',
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            database,
            host: configService.get('PSQL_HOST') || DEFAULT_PSQL_HOST,
            port: configService.get('PSQL_PORT') || DEFAULT_PSQL_PORT,
            username: configService.get('PSQL_USERNAME'),
            password: configService.get('PSQL_PASSWORD'),
            synchronize: synch,
            dropSchema: drop
        }
    },
    inject: [ConfigService],
}
