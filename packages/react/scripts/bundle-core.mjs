import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { green } from 'colorette';

const coreSourcePath = join(process.cwd(), '..', 'core');
const vendorPath = join(process.cwd(), 'vendor');
const coreTargetPath = join(vendorPath, 'discord-components-core');

// Read the core package version
const corePackageJsonPath = join(coreSourcePath, 'package.json');
const corePackageJson = JSON.parse(await readFile(corePackageJsonPath, 'utf-8'));
const coreVersion = corePackageJson.version;

// Clean up any existing vendor directory
try {
	await rm(vendorPath, { recursive: true, force: true });
} catch {
	// Ignore if doesn't exist
}

// Ensure vendor directory exists
await mkdir(vendorPath, { recursive: true });

// Copy the entire core package to vendor
await cp(coreSourcePath, coreTargetPath, { recursive: true, force: true });

// Create a postinstall script that will copy vendor to node_modules
const postinstallScript = `import { cp, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vendorPath = join(__dirname, 'vendor', 'discord-components-core');
const targetPath = join(__dirname, 'node_modules', 'discord-components-core');

try {
	await mkdir(join(__dirname, 'node_modules'), { recursive: true });
	await cp(vendorPath, targetPath, { recursive: true, force: true });
	console.log('✅ Installed bundled discord-components-core');
} catch (error) {
	console.error('Failed to install bundled discord-components-core:', error);
	process.exit(1);
}
`;

await writeFile(join(process.cwd(), 'postinstall.mjs'), postinstallScript);

// Update this package's package.json
const reactPackageJsonPath = join(process.cwd(), 'package.json');
const reactPackageJson = JSON.parse(await readFile(reactPackageJsonPath, 'utf-8'));

if (reactPackageJson.dependencies && reactPackageJson.dependencies['discord-components-core']) {
	delete reactPackageJson.dependencies['discord-components-core'];
	console.log(green(`✅ Removed workspace dependency on discord-components-core`));
}

// Ensure scripts object exists
if (!reactPackageJson.scripts) reactPackageJson.scripts = {};
reactPackageJson.scripts.postinstall = 'node postinstall.mjs';

await writeFile(reactPackageJsonPath, JSON.stringify(reactPackageJson, null, '\t') + '\n');
console.log(green(`✅ Updated package.json with postinstall script`));
console.log(green(`✅ Bundled discord-components-core into vendor directory`));
