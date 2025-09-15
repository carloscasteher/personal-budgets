export type JwtPayload = {
  /**
   * The subject (user) identifier of the token.
   */
  sub: string

  /**
   * The timestamp when the token was issued (Issued At).
   */
  iat: number

  /**
   * The timestamp when the token expires.
   */
  exp: number
}
