import { env } from '$env/dynamic/private';

export function load() {
	return {
		buildCommit: env.AVELUNE_BUILD_COMMIT?.trim() || null
	};
}
