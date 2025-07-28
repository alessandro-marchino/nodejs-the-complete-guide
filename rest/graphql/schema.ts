import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';
import { join } from 'path';

const schemaFile = readFileSync(join(__dirname, 'schema.graphql'), { encoding: 'utf8' });
const schema = buildSchema(schemaFile);

export default schema;
