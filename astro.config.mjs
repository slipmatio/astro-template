import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import tailwind from "@tailwindcss/vite";
import { unheadVueComposablesImports } from "@unhead/vue";
import { defineConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import PackageJson from "./package.json" with { type: "json" };

process.env.VITE_APP_VERSION = PackageJson.version;
if (process.env.NODE_ENV === "production") {
	process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString();
}

// https://astro.build/config
export default defineConfig({
	site: "https://next.slipmat.io",

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	integrations: [
		vue({ appEntrypoint: "/src/app.ts", devtools: true }),
		sitemap(),
	],
	vite: {
		plugins: [
			tailwind(),
			AutoImport({
				imports: [
					"vue",
					"vue-router",
					"pinia",
					{
						"@/store": ["useStore"],
					},
					unheadVueComposablesImports,
				],
				dts: "auto-imports.d.ts",
				vueTemplate: true,
			}),
			Components({
				dts: "components.d.ts",
			}),
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		css: {
			preprocessorMaxWorkers: true,
		},
	},
});
