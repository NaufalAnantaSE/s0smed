import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export function CreateCommentDocs() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add comment to post',
      description: 'Add a new comment to a specific post'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID',
      example: 1
    }),
    ApiBody({
      description: 'Comment data',
      schema: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            maxLength: 500,
            example: 'Great post! Thanks for sharing.',
            description: 'Comment content (max 500 characters)'
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Comment created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          content: { type: 'string', example: 'Great post! Thanks for sharing.' },
          userId: { type: 'number', example: 12 },
          postId: { type: 'number', example: 1 },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 12 },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found'
    })
  );
}

export function GetPostCommentsDocs() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiOperation({
      summary: 'Get post comments',
      description: 'Retrieve all comments for a specific post'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Comments retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Great post!' },
                userId: { type: 'number', example: 12 },
                postId: { type: 'number', example: 1 },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 12 },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    avatar_url: { type: 'string', nullable: true, example: 'https://...' }
                  }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time', nullable: true }
              }
            }
          },
          count: { type: 'number', example: 5 }
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found'
    })
  );
}

export function UpdateCommentDocs() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update comment',
      description: 'Update an existing comment (only by owner)'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Comment ID',
      example: 1
    }),
    ApiBody({
      description: 'Comment update data',
      schema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            maxLength: 500,
            example: 'Updated comment content...',
            description: 'Updated comment content (optional)'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Comment updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          content: { type: 'string', example: 'Updated comment content...' },
          userId: { type: 'number', example: 12 },
          postId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only edit your own comments'
    }),
    ApiResponse({
      status: 404,
      description: 'Comment not found'
    })
  );
}

export function DeleteCommentDocs() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete comment',
      description: 'Delete an existing comment (only by owner)'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Comment ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Comment deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Comment deleted successfully' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only delete your own comments'
    }),
    ApiResponse({
      status: 404,
      description: 'Comment not found'
    })
  );
}
