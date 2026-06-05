import { applyDecorators, type Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger'

import { ApiErrorResponseDto } from '../dto/api-response.dto'
import { PaginationMetaDto } from '../dto/pagination.dto'

export function ApiStandardErrors() {
  return applyDecorators(ApiBadRequestResponse({ type: ApiErrorResponseDto }))
}

export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(PaginationMetaDto, model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            $ref: getSchemaPath(PaginationMetaDto),
          },
        },
        required: ['items', 'meta'],
      },
    }),
  )
}

export function ApiEntityResponse<TModel extends Type<unknown>>(
  model: TModel,
  options?: { status?: 'ok' | 'created' },
) {
  const response =
    options?.status === 'created'
      ? ApiCreatedResponse({ type: model })
      : ApiOkResponse({ type: model })

  return applyDecorators(ApiExtraModels(model), response)
}

export function ApiArrayResponse<TModel extends Type<unknown>>(
  model: TModel,
  options?: { status?: 'ok' | 'created' },
) {
  const response =
    options?.status === 'created'
      ? ApiCreatedResponse({ type: model, isArray: true })
      : ApiOkResponse({ type: model, isArray: true })

  return applyDecorators(ApiExtraModels(model), response)
}

export function ApiNullableEntityResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        anyOf: [{ $ref: getSchemaPath(model) }, { type: 'null' }],
      },
    }),
  )
}
