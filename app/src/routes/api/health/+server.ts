import { json } from '@sveltejs/kit';

export function GET() {
  return json({
    status: 'ok',
    service: 'avelune-proto',
    version: '0.9.0-dev.3',
    timestamp: new Date().toISOString()
  });
}
