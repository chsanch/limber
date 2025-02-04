// Much of this is taken from: https://github.com/codemirror/lang-markdown/blob/main/src/markdown.ts
// import { completeFromList } from '@codemirror/autocomplete';
import {
  markdown,
  // markdownLanguage
} from '@codemirror/lang-markdown';
import {
  defineLanguageFacet,
  foldNodeProp,
  indentNodeProp,
  Language,
  languageDataProp,
  LanguageDescription,
  LanguageSupport,
} from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { Emoji, GFM, parser as baseParser, Subscript, Superscript, Table } from '@lezer/markdown';

import type {
  // BlockContext,
  // LeafBlock,
  // LeafBlockParser,
  // Line,
  // MarkdownConfig,
  MarkdownParser,
} from '@lezer/markdown';

// const hbsCompletions = completeFromList([
//   { label: '#each', type: 'keyword' },
//   { label: '#let', type: 'keyword' },
//   { label: '#if', type: 'keyword' },
// ]);

// javascriptLanguage.data.of({
//   autocomplete: completeFromList([
//     ...completionsOfObject(window),
//     ...completionsOfObject(document),
//   ]),
// }),

const data = defineLanguageFacet({
  block: [
    // { open: '<!--', close: '-->' },
    { open: '{{!', close: '}}' },
    { open: '{{!--', close: '--}}' },
  ],
});

const commonmark = baseParser.configure({
  props: [
    foldNodeProp.add((type) => {
      if (!type.is('Block') || type.is('Document')) return undefined;

      return (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: tree.to });
    }),
    indentNodeProp.add({
      Document: () => null,
    }),
    languageDataProp.add({
      Document: data,
    }),
  ],
});

function markdownLang(parser: MarkdownParser) {
  return new Language(data, parser);
}

// class HbsParser implements LeafBlockParser {
//   nextLine(_cx: BlockContext, _line: Line, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
//   finish(_cx: BlockContext, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
// }

// const Glimdown: MarkdownConfig = {
//   defineNodes: [{ name: 'S-Expression' }, { name: 'Block-S-Expression', block: true }],
//   parseBlock: [
//     {
//       name: 'S-Expression',
//       leaf(_, leaf): HbsParser | null {
//         return leaf.content.startsWith('{{') ? new HbsParser() : null;
//       },
//       endLeaf(_cx, _line, leaf) {
//         if (leaf.parsers.some((p) => p instanceof HbsParser)) {
//           return false;
//         }

//         return true;
//       },
//     },
//     {
//       name: 'Block-S-Expression',
//     },
//   ],
// };

const extendedMarkdown = commonmark.configure([
  GFM,
  Subscript,
  Superscript,
  Emoji,
  Table,
  // Glimdown,
]);

export function glimdown() {
  return markdown({
    base: markdownLang(extendedMarkdown),
    codeLanguages: [
      ...languages,
      LanguageDescription.of({
        name: 'javascript',
        alias: ['js', 'gjs'],
        async load() {
          const { javascriptLanguage } = await import('@codemirror/lang-javascript');

          return new LanguageSupport(javascriptLanguage);
        },
      }),
      // LanguageDescription.of({
      //   name: 'glimmer',
      //   alias: ['hbs'],
      //   async load() {
      //     return new LanguageSupport(markdownLanguage, [
      //       markdownLanguage.data.of({ autocomplete: hbsCompletions }),
      //     ]);
      //   },
      // }),
    ],
  });
}
