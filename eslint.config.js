// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'ui'],
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name='inject'][arguments.0.name='DialogRef']:not([typeArguments])",
          message: 'Always provide a generic type to DialogRef for type safety.',
        },
        {
          selector:
            "CallExpression[callee.name='inject'][arguments.0.name='DIALOG_DATA']:not([typeArguments])",
          message: 'Always provide a generic type to DIALOG_DATA for type safety.',
        },
        {
          selector: "Decorator[callee.name='Input']",
          message: 'Use signal-based input() instead of @Input() decorator.',
        },
        {
          selector: "Decorator[callee.name='Output']",
          message: 'Use signal-based output() instead of @Output() decorator.',
        },
        {
          selector:
            "ClassDeclaration > Decorator[callee.name='Component'] Property[key.name='standalone'][value.value=true]",
          message: 'Do not set standalone: true. It is the default in Angular v20+.',
        },
        {
          selector: "MethodDefinition[kind='constructor'] > FunctionExpression > Identifier",
          message: 'Use inject() function instead of constructor injection.',
        },
        {
          selector: "Decorator[callee.name='HostBinding'], Decorator[callee.name='HostListener']",
          message: 'Use host object in @Component or @Directive decorator instead of decorators.',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/elements-content': 'off',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "BoundAttribute[name='ngClass'], BoundAttribute[name='ngStyle']",
          message: 'Use [class.name] or [style.prop] bindings instead of ngClass/ngStyle.',
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
