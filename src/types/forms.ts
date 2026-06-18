export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}

/** Used by the CreateGroupForm */
export interface CreateGroupFormData {
  name: string
  description: string
}
