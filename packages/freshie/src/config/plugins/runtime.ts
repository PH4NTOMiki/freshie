import { join } from 'path';
import * as fs from '../../utils/fs';

const RUNTIME = join(__dirname, '..', 'runtime', 'index.dom.js');

async function xform(file: string, routes: Build.Route[], isDOM: boolean): Promise<string> {
	let count=0, imports='', $routes='';
	const Layouts: Map<string, string> = new Map;
	const fdata = await fs.read(file, 'utf8');

	// TODO: multiple layout nesting
	routes.forEach((tmp, idx) => {
		if ($routes) $routes += '\n\t';

		if (isDOM) {
			let views = [`import('${tmp.file}')`];
			if (tmp.layout) views.unshift(`import('${tmp.layout}')`);
			$routes += `define('${tmp.pattern}', () => Promise.all([ ${views} ]));`;
		} else {
			let layout = tmp.layout && Layouts.get(tmp.layout);
			if (tmp.layout && !layout) {
				Layouts.set(tmp.layout, layout = `$Layout${count++}`);
				imports += `import * as ${layout} from '${tmp.layout}';\n`;
			}

			let views = [`$Route${idx}`];
			if (layout) views.unshift(layout);
			imports += `import * as $Route${idx} from '${tmp.file}';\n`;
			$routes += `define('${tmp.pattern}', ${views});`;
		}
	});

	if (imports) imports += '\n';
	return imports + fdata.replace('/* <ROUTES> */', $routes);
}

export function Runtime(routes: Build.Route[], isDOM: boolean): Rollup.Plugin {
	const ident = 'freshie/runtime';

	const Plugin: Rollup.Plugin = {
		name: 'plugins/runtime',
		load: id => {
			if (id === ident) return xform(RUNTIME, routes, isDOM);
			if (/[\\\/]+@freshie\/ssr/.test(id)) return xform(id, routes, isDOM);
		}
	};

	if (isDOM) {
		Plugin.resolveId = id => id === ident ? id : null;
	}

	return Plugin;
}
