import { readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { green } from 'colorette';

// Restore the workspace protocol
const reactPackageJsonPath = join(process.cwd(), 'package.json');
const reactPackageJson = JSON.parse(await readFile(reactPackageJsonPath, 'utf-8'));

if (!reactPackageJson.dependencies) reactPackageJson.dependencies = {};
reactPackageJson.dependencies['discord-components-core'] = 'workspace:^';

// Remove postinstall script
if (reactPackageJson.scripts && reactPackageJson.scripts.postinstall === 'node postinstall.mjs') {
	delete reactPackageJson.scripts.postinstall;
	if (Object.keys(reactPackageJson.scripts).length === 0) {
		delete reactPackageJson.scripts;
	}
}

await writeFile(reactPackageJsonPath, JSON.stringify(reactPackageJson, null, '\t') + '\n');

// Remove postinstall.mjs file
try {
	await rm(join(process.cwd(), 'postinstall.mjs'), { force: true });
} catch {
	// Ignore if doesn't exist
}

try {
	await rm(join(process.cwd(), 'vendor'), { recursive: true, force: true });
} catch {
	// Ignore if doesn't exist
}

console.log(green(`✅ Restored workspace protocol for discord-components-core`));
