export class ApiRequestError extends Error {
  readonly status: number
  readonly code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class SessionExpiredError extends ApiRequestError {
  constructor() {
    super('Sessão expirada. Faça login novamente.', 401, 'unauthorized')
    this.name = 'SessionExpiredError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFoundError extends ApiRequestError {
  constructor(message: string) {
    super(message, 404, 'not_found')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ForbiddenError extends ApiRequestError {
  constructor(message: string) {
    super(message, 403, 'forbidden')
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InviteError extends ApiRequestError {
  constructor(message: string, status: number, code: string) {
    super(message, status, code)
    this.name = 'InviteError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class DrawCompletedError extends InviteError {
  constructor(message: string) {
    super(message, 409, 'conflict')
    this.name = 'DrawCompletedError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InvalidInviteError extends InviteError {
  constructor(message: string, status: number) {
    super(message, status, status === 404 ? 'not_found' : 'conflict')
    this.name = 'InvalidInviteError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
