import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export function LikePostDocs() {
  return applyDecorators(
    ApiTags('Likes'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Like a post',
      description: 'Add a like to a specific post'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID',
      example: 1
    }),
    ApiResponse({
      status: 201,
      description: 'Post liked successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Post liked successfully' }
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
    }),
    ApiResponse({
      status: 409,
      description: 'You have already liked this post'
    })
  );
}

export function UnlikePostDocs() {
  return applyDecorators(
    ApiTags('Likes'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Unlike a post',
      description: 'Remove your like from a specific post'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Post unliked successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Post unliked successfully' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found or you have not liked this post'
    })
  );
}

export function GetPostLikesDocs() {
  return applyDecorators(
    ApiTags('Likes'),
    ApiOperation({
      summary: 'Get post likes',
      description: 'Get all users who liked a specific post'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Post likes retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          likes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
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
                createdAt: { type: 'string', format: 'date-time' }
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
