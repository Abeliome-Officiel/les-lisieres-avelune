import { Pool } from 'pg';

type QueryResult<Row> = { rows: Row[]; rowCount: number | null };
export interface SqlClient { query<Row extends Record<string, unknown> = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<Row>> }

let clientPromise: Promise<SqlClient> | null = null;
export function database(): Promise<SqlClient> {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
	clientPromise ??= Promise.resolve(new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }));
	return clientPromise;
}
