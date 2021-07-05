declare type CompilerOptions = {
  warn?: Function; // allow customizing warning in different environments; e.g. node
  expectHTML?: boolean; // only false for non-web builds
  modules?: Array<ModuleOptions>; // platform specific modules; e.g. style; class
  staticKeys?: string; // a list of AST properties to be considered static; for optimization
  directives?: { [key: string]: Function }; // platform specific directives
  isUnaryTag?: (tag: string) => ?boolean; // check if a tag is unary for the platform
  canBeLeftOpenTag?: (tag: string) => ?boolean; // check if a tag can be left opened
  isReservedTag?: (tag: string) => ?boolean; // check if a tag is a native for the platform
  mustUseProp?: (tag: string, type: ?string, name: string) => boolean; // check if an attribute should be bound as a property
  isPreTag?: (attr: string) => ?boolean; // check if a tag needs to preserve whitespace
  getTagNamespace?: (tag: string) => ?string; // check the namespace for a tag
  transforms?: Array<Function>; // a list of transforms on parsed AST before codegen
  preserveWhitespace?: boolean;
  isFromDOM?: boolean;
  shouldDecodeTags?: boolean;
  shouldDecodeNewlines?: boolean;

  // for ssr optimization compiler
  scopeId?: string;

  // runtime user-configurable
  delimiters?: [string, string]; // template delimiters

  // allow user kept comments
  comments?: boolean
};

declare type CompiledResult = {
  ast: ?ASTElement;
  render: string;
  staticRenderFns: Array<string>;
  stringRenderFns?: Array<string>;
  errors?: Array<string>;
  tips?: Array<string>;
};

declare type ModuleOptions = {
  // returning an ASTElement from pre/transforms replaces the element
  preTransformNode: (el: ASTElement) => ?ASTElement;
  transformNode: (el: ASTElement) => ?ASTElement;
  // cannot return replacement in postTransform because tree is already finalized
  postTransformNode: (el: ASTElement) => void;
  genData: (el: ASTElement) => string; // generate extra data string for an element
  transformCode?: (el: ASTElement, code: string) => string; // further transform generated code for an element
  staticKeys?: Array<string>; // AST properties to be considered static
};

declare type ASTModifiers = { [key: string]: boolean };
declare type ASTIfCondition = { exp: ?string; block: ASTElement };
declare type ASTIfConditions = Array<ASTIfCondition>;

declare type ASTElementHandler = {
  value: string;
  modifiers: ?ASTModifiers;
};

declare type ASTElementHandlers = {
  [key: string]: ASTElementHandler | Array<ASTElementHandler>;
};

declare type ASTDirective = {
  name: string;
  rawName: string;
  value: string;
  arg: ?string;
  modifiers: ?ASTModifiers;
};

declare type ASTNode = ASTElement | ASTText | ASTExpression;

declare type ASTElement = {
  type: 1;
  tag: string; // 标签名称
  attrsList: Array<{ name: string; value: string }>;
  attrsMap: { [key: string]: string | null };
  parent: ASTElement | void; // 父级节点
  children: Array<ASTNode>; // 子级节点

  processed?: true;

  static?: boolean; // 静态节点
  staticRoot?: boolean;
  staticInFor?: boolean;
  staticProcessed?: boolean;
  hasBindings?: boolean;

  text?: string;
  attrs?: Array<{ name: string; value: string }>;
  props?: Array<{ name: string; value: string }>;
  plain?: boolean;
  pre?: true;
  ns?: string;

  component?: string;
  inlineTemplate?: true;
  transitionMode?: string | null;
  slotName?: ?string;
  slotTarget?: ?string;
  slotScope?: ?string;
  scopedSlots?: { [name: string]: ASTElement };

  ref?: string;
  refInFor?: boolean; // for中的ref

  if?: string; // v-if
  ifProcessed?: boolean;
  elseif?: string;
  else?: true;
  ifConditions?: ASTIfConditions;

  for?: string; // v-for
  forProcessed?: boolean;
  key?: string; // key
  alias?: string;
  iterator1?: string;
  iterator2?: string;

  staticClass?: string; // 静态类名
  classBinding?: string; // 绑定类名
  staticStyle?: string; // 静态样式
  styleBinding?: string; // 绑定样式
  events?: ASTElementHandlers; // 事件
  nativeEvents?: ASTElementHandlers; // 原生事件

  transition?: string | true;
  transitionOnAppear?: boolean;

  model?: { // v-model
    value: string;
    callback: string;
    expression: string;
  };

  directives?: Array<ASTDirective>;

  forbidden?: true;
  once?: true;
  onceProcessed?: boolean;
  wrapData?: (code: string) => string;
  wrapListeners?: (code: string) => string;

  // 2.4 ssr optimization
  ssrOptimizability?: number;

  // weex specific
  appendAsTree?: boolean;
};

declare type ASTExpression = {
  type: 2;
  expression: string;
  text: string;
  static?: boolean;
  // 2.4 ssr optimization
  ssrOptimizability?: number;
};

declare type ASTText = {
  type: 3;
  text: string;
  static?: boolean;
  isComment?: boolean;
  // 2.4 ssr optimization
  ssrOptimizability?: number;
};

// SFC-parser related declarations

// an object format describing a single-file component.
declare type SFCDescriptor = {
  template: ?SFCBlock;
  script: ?SFCBlock;
  styles: Array<SFCBlock>;
  customBlocks: Array<SFCCustomBlock>;
}

declare type SFCCustomBlock = {
  type: string;
  content: string;
  start?: number;
  end?: number;
  src?: string;
  attrs: {[attribute: string]: string};
};

declare type SFCBlock = {
  type: string;
  content: string;
  start?: number;
  end?: number;
  lang?: string;
  src?: string;
  scoped?: boolean;
  module?: string | boolean;
};
