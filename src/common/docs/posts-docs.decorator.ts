import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export function PostsCreateDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create new post',
      description: 'Create a new post with title, optional content, and optional image. Must have either content or image.'
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Post creation data',
      schema: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            maxLength: 100,
            example: 'My Amazing Post',
            description: 'Post title (max 100 characters)'
          },
          content: {
            type: 'string',
            maxLength: 500,
            example: 'This is the content of my post...',
            description: 'Post content (max 500 characters, optional if image provided)'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Post image (optional if content provided)'
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Post created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'My Amazing Post' },
          content: { type: 'string', example: 'This is the content...' },
          photo_content: { type: 'string', nullable: true, example: 'https://imagekit.io/...' },
          authorId: { type: 'number', example: 12 },
          likeCount: { type: 'number', example: 0 },
          commentCount: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Post must have either content or image'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token'
    })
  );
}

export function PostsGetAllDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Get all posts',
      description: 'Retrieve all posts with like and comment counts'
    }),
    ApiResponse({
      status: 200,
      description: 'Posts retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'My Amazing Post' },
            content: { type: 'string', nullable: true, example: 'This is the content...' },
            photo_content: { type: 'string', nullable: true, example: 'https://imagekit.io/...' },
            authorId: { type: 'number', example: 12 },
            likeCount: { type: 'number', example: 5 },
            commentCount: { type: 'number', example: 3 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        }
      }
    })
  );
}

export function PostsGetMyDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get my posts',
      description: 'Retrieve all posts created by the authenticated user (from JWT token)'
    }),
    ApiResponse({
      status: 200,
      description: 'User posts retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'My Amazing Post' },
            content: { type: 'string', nullable: true, example: 'This is the content...' },
            photo_content: { type: 'string', nullable: true, example: 'https://imagekit.io/...' },
            authorId: { type: 'number', example: 12 },
            likeCount: { type: 'number', example: 5 },
            commentCount: { type: 'number', example: 3 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token'
    })
  );
}

export function PostsGetByIdDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Get post by ID',
      description: 'Retrieve a specific post by its ID'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID (not user ID)',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Post retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'My Amazing Post' },
          content: { type: 'string', nullable: true, example: 'This is the content...' },
          photo_content: { type: 'string', nullable: true, example: 'https://imagekit.io/...' },
          authorId: { type: 'number', example: 12 },
          likeCount: { type: 'number', example: 5 },
          commentCount: { type: 'number', example: 3 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found'
    })
  );
}

export function PostsUpdateDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update post',
      description: 'Update an existing post (only by owner). User ownership is verified automatically from JWT token.'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID to update (not user ID - user is identified from JWT token)',
      example: 1
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Post update data',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            maxLength: 100,
            example: 'Updated Post Title',
            description: 'Post title (optional)'
          },
          content: {
            type: 'string',
            maxLength: 500,
            example: 'Updated content...',
            description: 'Post content (optional)'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'New post image (optional)'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Post updated successfully'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only update your own posts'
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found'
    })
  );
}

export function PostsDeleteDocs() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete post',
      description: 'Delete an existing post (only by owner) - Soft delete. User ownership is verified automatically from JWT token.'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Post ID to delete (not user ID - user is identified from JWT token)',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Post deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Post deleted successfully' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only delete your own posts'
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found'
    })
  );
}
