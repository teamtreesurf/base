import { api } from '~server'
import {
  ASTCodeCardType,
  ASTFormType,
  NestedPartial,
  Scope,
  ScopeType,
} from '~server/type'
import shared from '~shared'

export * from './base'
export * from './case'
export * from './fuse'
export * from './head'
export * from './hold'
export * from './like'
export * from './link'
export * from './note'
export * from './stem'
export * from './task'
export * from './wear'

export function process_codeCard_form(
  scope: ScopeType<Scope.Nest>,
): void {
  const form: NestedPartial<ASTFormType> = {
    base: [],
    hook: {},
    like: 'form',
    link: {},
    name: '',
    task: {},
    wear: {},
  }

  scope.data.nest.nest.slice(1).forEach(nest => {
    if (shared.isSimpleTerm(nest)) {
      const term = shared.getSimpleTerm(nest)
      const nestedScope = api.extendScope({ nest }, scope)
      switch (term) {
        case 'link':
          api.process_codeCard_formLink(nestedScope)
          break
        case 'task':
          api.process_codeCard_formTask(nestedScope)
          break
        case 'head':
          api.process_codeCard_formHead(nestedScope)
          break
        case 'wear':
          api.process_codeCard_formWear(nestedScope)
          break
        case 'base':
          api.process_codeCard_formBase(nestedScope)
          break
        case 'case':
          api.process_codeCard_formCase(nestedScope)
          break
        case 'fuse':
          api.process_codeCard_formFuse(nestedScope)
          break
        case 'hold':
          api.process_codeCard_formHold(nestedScope)
          break
        case 'stem':
          api.process_codeCard_formStem(nestedScope)
          break
        case 'note':
          api.process_codeCard_formNote(nestedScope)
          break
        case 'like':
          api.process_codeCard_formLike(nestedScope)
          break
        default:
          api.throwError(
            api.generateUnknownTermError(nestedScope),
          )
      }
    } else {
      throw new Error(`${card.seed.link}`)
    }
  })

  if (scope.parent) {
    if (form.name && scope.parent.data.publicFormMesh) {
      scope.parent.data.publicFormMesh[form.name] = form
    }
  }
}