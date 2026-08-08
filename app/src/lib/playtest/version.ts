export const PLAYTEST_VERSION = 'PROTO-0.2.2-playtest';

export function fullPlaytestVersion(commit?: string) {
	return `${PLAYTEST_VERSION} · ${commit?.trim() || 'build local'}`;
}
