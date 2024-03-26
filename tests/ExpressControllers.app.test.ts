import { ExpressCoreApp } from '../src'

jestCore.runApp('express-controllers', {
  coreConfigOverride: {
    apps: { location: './tests/__fixtures__' },
    config: { location: './tests/__fixtures__/config' },
    modules: { location: './tests/__fixtures__' },
    logger: { silence: true }
  }
})

describe(ExpressCoreApp, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    await fGet('good')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ get: true })

    await fPost('good/post-end')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ post: true })

    await fPatch('good/patch-end')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ patch: true })

    await fPut('good/put-end')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ put: true })

    await fDelete('good/delete-end')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ delete: true })

    await fHead('good/head-end')
    expect(fResponse).toHaveReturnedWithStatus('OK')

    await fGet('nonexistent')
    expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

    await fGet('bad')
    expect(fResponse).toHaveReturnedWithStatus('INTERNAL_SERVER_ERROR')
  })
})
