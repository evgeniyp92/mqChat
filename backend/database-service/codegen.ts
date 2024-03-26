import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.ts",
  generates: {
    "__generated__/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb"],
      config: {
        contextType: "../context#DataSourceContext",
        mappers: {},
      },
    },
  },
};

export default config;
