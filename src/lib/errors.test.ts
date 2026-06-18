import {
  ApiRequestError,
  SessionExpiredError,
  NotFoundError,
  ForbiddenError,
  InviteError,
  DrawCompletedError,
  InvalidInviteError,
} from './errors'

describe('ApiRequestError', () => {
  it('stores message, status e code', () => {
    const err = new ApiRequestError('mensagem', 500, 'internal_server_error')
    expect(err.message).toBe('mensagem')
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
    expect(err.name).toBe('ApiRequestError')
  })

  it('é instanceof Error e ApiRequestError', () => {
    const err = new ApiRequestError('msg', 500, 'code')
    expect(err instanceof Error).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })
})

describe('SessionExpiredError', () => {
  it('tem status 401, code unauthorized e mensagem padrão em pt-BR', () => {
    const err = new SessionExpiredError()
    expect(err.status).toBe(401)
    expect(err.code).toBe('unauthorized')
    expect(err.message).toBe('Sessão expirada. Faça login novamente.')
    expect(err.name).toBe('SessionExpiredError')
  })

  it('é instanceof ApiRequestError', () => {
    const err = new SessionExpiredError()
    expect(err instanceof SessionExpiredError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('não é instanceof NotFoundError', () => {
    expect(new SessionExpiredError() instanceof NotFoundError).toBe(false)
  })
})

describe('NotFoundError', () => {
  it('tem status 404 e code not_found', () => {
    const err = new NotFoundError('recurso não encontrado')
    expect(err.status).toBe(404)
    expect(err.code).toBe('not_found')
    expect(err.name).toBe('NotFoundError')
    expect(err.message).toBe('recurso não encontrado')
  })

  it('é instanceof ApiRequestError mas não SessionExpiredError', () => {
    const err = new NotFoundError('msg')
    expect(err instanceof NotFoundError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
    expect(err instanceof SessionExpiredError).toBe(false)
  })
})

describe('ForbiddenError', () => {
  it('tem status 403 e code forbidden', () => {
    const err = new ForbiddenError('acesso negado')
    expect(err.status).toBe(403)
    expect(err.code).toBe('forbidden')
    expect(err.name).toBe('ForbiddenError')
  })

  it('é instanceof ApiRequestError mas não NotFoundError', () => {
    const err = new ForbiddenError('msg')
    expect(err instanceof ForbiddenError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
    expect(err instanceof NotFoundError).toBe(false)
  })
})

describe('DrawCompletedError', () => {
  it('tem status 409 e code conflict', () => {
    const err = new DrawCompletedError('sorteio realizado')
    expect(err.status).toBe(409)
    expect(err.code).toBe('conflict')
    expect(err.name).toBe('DrawCompletedError')
    expect(err.message).toBe('sorteio realizado')
  })

  it('é instanceof InviteError e ApiRequestError', () => {
    const err = new DrawCompletedError('msg')
    expect(err instanceof DrawCompletedError).toBe(true)
    expect(err instanceof InviteError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('não é instanceof InvalidInviteError', () => {
    expect(new DrawCompletedError('msg') instanceof InvalidInviteError).toBe(false)
  })
})

describe('InvalidInviteError', () => {
  it('tem code not_found quando status é 404', () => {
    const err = new InvalidInviteError('convite não encontrado', 404)
    expect(err.status).toBe(404)
    expect(err.code).toBe('not_found')
    expect(err.name).toBe('InvalidInviteError')
  })

  it('tem code conflict quando status é 409', () => {
    const err = new InvalidInviteError('convite expirado', 409)
    expect(err.status).toBe(409)
    expect(err.code).toBe('conflict')
  })

  it('é instanceof InviteError e ApiRequestError', () => {
    const err = new InvalidInviteError('msg', 404)
    expect(err instanceof InvalidInviteError).toBe(true)
    expect(err instanceof InviteError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('não é instanceof DrawCompletedError', () => {
    expect(new InvalidInviteError('msg', 404) instanceof DrawCompletedError).toBe(false)
  })
})
