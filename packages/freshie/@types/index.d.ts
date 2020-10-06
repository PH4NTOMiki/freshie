type Nullable<T> = T | null;
type Arrayable<T> = T[] | T;
type Promisable<T> = Promise<T> | T;

type Dict<T> = Record<string, T>;
type Subset<T, V=any> = T & Dict<V>;

type TODO = any;

// ---

declare namespace Argv {
	interface Options {
		cwd: string;
		minify: boolean;
		//
		src: string;
		dest: string;
		srcDir: string;
		destDir: string;
		//
		isProd: boolean;
	}
}

declare namespace Config {
	type Rollup = Rollup.Config;

	interface Options extends Dict<any> {
		publicPath: string;

		alias: Subset<{
			entries: Subset<{
				'~routes': string;
				'~components': string;
				'~assets': string;
				'~utils': string;
				'~tags': string;
			}, string>;
		}>;

		ssr: {
			type: 'worker' | 'lambda' | 'node';
			entry: string; // path to entry
			render: string; // path to renderer
			// render<T>(): Promisable<T>;
			bucket?: string;
		};

		routes: {
			dir: string;
			test: RegExp;
		};

		assets: {
			test: RegExp;
		};

		replace: Subset<{
			'__DEV__': string;
			'__BROWSER__': string;
			'process.browser': string;
			'process.env.NODE_ENV': string;
		}, string>;

		resolve: Subset<{
			extensions: string[];
			mainFields: string[];
		}>;

		commonjs: Subset<{
			extensions: string[];
		}>;

		json: Subset<{
			preferConst: boolean;
			namedExports: boolean;
			indent: string;
		}>;

		terser: Subset<{
			mangle: boolean;
			compress: boolean;
			output: Dict<any>;
		}>;
	}

	interface Context {
		ssr: boolean;
		isProd: boolean;
	}

	namespace Customize {
		type Rollup = (config: Config.Rollup, options: Config.Options, context: Config.Context) => void;
		type Options = {
			[K in keyof Config.Options]: (options: Config.Options[K], context: Config.Context) => void;
		};
	}
}

declare namespace Build {
	interface Route {
		file: string;
		pattern: string;
		layout: Nullable<string>;
		wild: Nullable<string>;
	}
}

declare namespace Runtime {
	type Params = Dict<string>;

	interface Request {
		params: Params;
		pathname: string;
		search: string;
		query: Dict<string>;
	}

	interface Options {
		basePath: string;
		render<C extends Function, P extends Dict<any>>(Component: C, props: P): void;
	}
}
