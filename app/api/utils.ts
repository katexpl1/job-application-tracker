export enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

export function errorResponse(message: string, status: HttpStatus) {
  return Response.json({ error: message }, { status });
}
