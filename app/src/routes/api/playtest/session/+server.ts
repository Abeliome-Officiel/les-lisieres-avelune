import { json } from '@sveltejs/kit';
import { sessionService } from '$lib/server/playtest/runtime.js';
export async function POST() { try { const value = await (await sessionService()).create(); return json({ code:value.code,state:value.gameState,stateVersion:value.stateVersion,gameVersion:value.gameVersion },{status:201}); } catch { return json({message:'Impossible de créer une partie pour le moment.'},{status:503}); } }
