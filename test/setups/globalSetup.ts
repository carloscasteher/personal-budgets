import { afterAll, afterEach, beforeAll, beforeEach, expect } from 'vitest'

import type { Closable } from '../../src/shared/infrastructure/repositories/Closable.ts'
import { HTTPError } from 'ky'
import type { Reseteable } from '../../src/shared/infrastructure/repositories/Reseteable.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'

let repos = [] as (Closable & Reseteable)[]

function isNotE2E(fileName: string) {
  return !fileName.match(/e2e/)
}

beforeAll(async (context) => {
  if (isNotE2E(context.name)) {
    return
  }
  const { container } = await import('./container.ts')

  repos = await Promise.all([container.getAsync<Closable & Reseteable>(Token.BUDGETS_REPOSITORY)])
})

beforeEach(async (context) => {
  if (isNotE2E(context.task.file.name)) {
    return
  }
  await Promise.all(repos.map((repo) => repo.reset()))
})

afterEach(async (context) => {
  if (isNotE2E(context.task.file.name)) {
    return
  }
})

afterAll(async (context) => {
  if (isNotE2E(context.name)) {
    return
  }
  for (const repo of repos) {
    await repo.close()
  }
})

expect.extend({
  hasStatus(received, expected) {
    if (received instanceof HTTPError) {
      const actualStatus = received.response.status
      return {
        pass: actualStatus === expected,
        message: () => `Response has status ${actualStatus} instead of ${expected}`,
      }
    }
    if (received instanceof Response) {
      const actualStatus = received.status
      return {
        pass: actualStatus === expected,
        message: () => `Response has status ${actualStatus} instead of ${expected}`,
      }
    }

    return {
      pass: false,
      message: () => `Unknown type ${received}`,
    }
  },

  async hasBody(received, expected) {
    if (received instanceof HTTPError) {
      const body = await received.response.json()
      const pass = this.equals(body, expected)

      return {
        pass,
        message: () =>
          pass
            ? `Expected body not to equal ${this.utils.printExpected(expected)}`
            : `Expected body to equal ${this.utils.printExpected(
                expected
              )}\nReceived: ${this.utils.printReceived(body)}`,
      }
    }
    if (received instanceof Response) {
      const body = await received.json()
      const pass = this.equals(body, expected)

      return {
        pass,
        message: () =>
          pass
            ? `Expected body not to equal ${this.utils.printExpected(expected)}`
            : `Expected body to equal ${this.utils.printExpected(
                expected
              )}\nReceived: ${this.utils.printReceived(body)}`,
      }
    }
    if (received instanceof Promise) {
      const response = await received
      const body = await response.json()
      const pass = this.equals(body, expected)

      return {
        pass,
        message: () =>
          pass
            ? `Expected body not to equal ${this.utils.printExpected(expected)}`
            : `Expected body to equal ${this.utils.printExpected(
                expected
              )}\nReceived: ${this.utils.printReceived(body)}`,
      }
    }

    return {
      pass: false,
      message: () => `Unknown type ${received}`,
    }
  },
})
