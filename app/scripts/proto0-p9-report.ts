import {
	createProto0SimulationAudit,
	formatProto0SimulationAuditMarkdown
} from '../src/lib/proto0/index.js';

const audit =
	createProto0SimulationAudit();

process.stdout.write(
	formatProto0SimulationAuditMarkdown(
		audit
	)
);
