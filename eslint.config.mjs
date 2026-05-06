// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'design_handoff_dc_portfolio/**',
      '.output/**',
      '.nuxt/**',
      'node_modules/**',
      'dist/**'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
