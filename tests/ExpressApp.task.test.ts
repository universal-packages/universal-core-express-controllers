import { Logger } from '@universal-packages/logger'
import { populateTemplates } from '@universal-packages/template-populator'
import ExpressAppTask from '../src/ExpressApp.universal-core-task'

jest.mock('@universal-packages/template-populator')

describe('ExpressAppTask', (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const logger = new Logger({ silence: true })

    let task = new ExpressAppTask('init', [], {}, logger, {})
    await task.exec()
    expect(populateTemplates).toHaveBeenCalled()
  })
})
