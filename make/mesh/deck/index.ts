import {
  Base,
  Color,
  DEFAULT_CONTAINER_SCOPE,
  Link,
  LinkHint,
  Mesh,
  SiteModuleType,
  code,
} from '~'
import type { SiteProcessInputType } from '~'

export * from './deck/index.js'

export function generate_deckCard(
  input: SiteProcessInputType,
): MeshPackageModuleType {
  code.assertNest(input.module, Nest.PackageModule)

  const deck = input.module.children.find(
    (node): node is MeshPackageType => code.isMesh(node, Mesh.Package),
  )

  code.assertRecord(deck)

  return {
    base: input.module.base,
    deck,
    directory: input.module.directory,
    id: input.module.id,
    link: input.module.link,
    path: input.module.path,
    public: {},
    scope: input.scope,
    text: input.module.text,
    textByLine: input.module.textByLine,
    type: Mesh.PackageModule,
  }
}

export function handle_deckCard(base: Base, link: string): void {
  code.process_deckCard(base, link)
}

/**
 * Entrypoint function.
 */
export function process_deckCard(base: Base, link: string): void {
  const parse = code.loadLinkModule(base, link)
  const card = base.card(link)
  const container = code.createContainerScope(DEFAULT_CONTAINER_SCOPE)
  const scope = code.createStepScope(container)

  const red = code.createTopRed({
    children: [],
    scope,
    type: Mesh.Gather,
  })

  const blue = code.createTopBlue({
    type: Mesh.PackageModule,
  })

  const baseModule: Partial<SiteModuleType> = {
    ...parse,
    base,
    blue,
    id: card.id,
    isModule: true,
    link: code.createTopLink(parse.linkTree),
    red,
    scope,
  }

  baseModule.module = baseModule as SiteModuleType
  baseModule.environment = code.createEnvironment(baseModule)

  const module = baseModule as SiteModuleType

  code.assertString(module.text)
  code.assertLink(module.linkTree, Link.Tree)

  card.bind(module)

  if (module.text.trim()) {
    module.linkTree.nest.forEach((nest, index) => {
      code.addTask(base, () => {
        code.process_deckCard_nestedChildren(
          code.withLink(module, nest, index),
        )
      })
    })
  }
}

export function process_deckCard_nestedChildren(
  input: SiteProcessInputType,
): void {
  const type = code.getLinkHint(input)
  switch (type) {
    case LinkHint.StaticTerm: {
      code.process_deckCard_staticTerm(input)
      break
    }
    default:
      code.throwError(code.generateUnhandledNestCaseError(input, type))
  }
}

export function process_deckCard_staticTerm(
  input: SiteProcessInputType,
): void {
  const term = code.resolveTermString(input)
  switch (term) {
    case 'deck':
      code.process_deckCard_deck(input)
      break
    default:
      code.throwError(code.generateUnhandledTermCaseError(input))
  }
}
