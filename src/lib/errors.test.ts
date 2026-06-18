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
  it('stores message, status and code', () => {
    const err = new ApiRequestError('mensagem', 500, 'internal_server_error')
    expect(err.message).toBe('mensagem')
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
    expect(err.name).toBe('ApiRequestError')
  })

  it('is instanceof Error and ApiRequestError', () => {
    const err = new ApiRequestError('msg', 500, 'code')
    expect(err instanceof Error).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })
})

describe('SessionExpiredError', () => {
  it('has status 401, code unauthorized and default message', () => {
    const err = new SessionExpiredError()
    expect(err.status).toBe(401)
    expect(err.code).toBe('unauthorized')
    expect(err.message).toBe('Sessão expirada. Faça login novamente.')
    expect(err.name).toBe('SessionExpiredError')
  })

  it('is instanceof ApiRequestError', () => {
    const err = new SessionExpiredError()
    expect(err instanceof SessionExpiredError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('is not instanceof NotFoundError', () => {
    expect(new SessionExpiredError() instanceof NotFoundError).toBe(false)
  })
})

describe('NotFoundError', () => {
  it('has status 404 and code not_found', () => {
    const err = new NotFoundError('recurso não encontrado')
    expect(err.status).toBe(404)
    expect(err.code).toBe('not_found')
    expect(err.name).toBe('NotFoundError')
    expect(err.message).toBe('recurso não encontrado')
  })

  it('is instanceof ApiRequestError but not SessionExpiredError', () => {
    const err = new NotFoundError('msg')
    expect(err instanceof NotFoundError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
    expect(err instanceof SessionExpiredError).toBe(false)
  })
})

describe('ForbiddenError', () => {
  it('has status 403 and code forbidden', () => {
    const err = new ForbiddenError('acesso negado')
    expect(err.status).toBe(403)
    expect(err.code).toBe('forbidden')
    expect(err.name).toBe('ForbiddenError')
  })

  it('is instanceof ApiRequestError but not NotFoundError', () => {
    const err = new ForbiddenError('msg')
    expect(err instanceof ForbiddenError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
    expect(err instanceof NotFoundError).toBe(false)
  })
})

describe('DrawCompletedError', () => {
  it('has status 409 and code conflict', () => {
    const err = new DrawCompletedError('sorteio realizado')
    expect(err.status).toBe(409)
    expect(err.code).toBe('conflict')
    expect(err.name).toBe('DrawCompletedError')
    expect(err.message).toBe('sorteio realizado')
  })

  it('is instanceof InviteError and ApiRequestError', () => {
    const err = new DrawCompletedError('msg')
    expect(err instanceof DrawCompletedError).toBe(true)
    expect(err instanceof InviteError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('is not instanceof InvalidInviteError', () => {
    expect(new DrawCompletedError('msg') instanceof InvalidInviteError).toBe(false)
  })
})

describe('InvalidInviteError', () => {
  it('has code not_found when status is 404', () => {
    const err = new InvalidInviteError('convite não encontrado', 404)
    expect(err.status).toBe(404)
    expect(err.code).toBe('not_found')
    expect(err.name).toBe('InvalidInviteError')
  })

  it('has code conflict when status is 409', () => {
    const err = new InvalidInviteError('convite expirado', 409)
    expect(err.status).toBe(409)
    expect(err.code).toBe('conflict')
  })

  it('is instanceof InviteError and ApiRequestError', () => {
    const err = new InvalidInviteError('msg', 404)
    expect(err instanceof InvalidInviteError).toBe(true)
    expect(err instanceof InviteError).toBe(true)
    expect(err instanceof ApiRequestError).toBe(true)
  })

  it('is not instanceof DrawCompletedError', () => {
    expect(new InvalidInviteError('msg', 404) instanceof DrawCompletedError).toBe(false)
  })
})
