import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow)
        private readonly followsRepository: Repository<Follow>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async followUser(followerId: number, followingId: number): Promise<{ message: string }> {
        
        if (followerId === followingId) {
            throw new ForbiddenException('You cannot follow yourself');
        }

        
        const userToFollow = await this.usersRepository.findOne({ where: { id: followingId } });
        if (!userToFollow) {
            throw new NotFoundException(`User with ID ${followingId} not found`);
        }

        
        const follower = await this.usersRepository.findOne({ where: { id: followerId } });
        if (!follower) {
            throw new NotFoundException(`User with ID ${followerId} not found`);
        }

        
        const existingFollow = await this.followsRepository.findOne({
            where: { followerId, followingId }
        });

        if (existingFollow) {
            throw new ConflictException('You are already following this user');
        }

        
        const follow = this.followsRepository.create({
            followerId,
            followingId,
            follower,
            following: userToFollow,
        });

        await this.followsRepository.save(follow);
        return { message: 'User followed successfully' };
    }

    async unfollowUser(followerId: number, followingId: number): Promise<{ message: string }> {
        
        if (followerId === followingId) {
            throw new ForbiddenException('You cannot unfollow yourself');
        }

        
        const userToUnfollow = await this.usersRepository.findOne({ where: { id: followingId } });
        if (!userToUnfollow) {
            throw new NotFoundException(`User with ID ${followingId} not found`);
        }

        
        const existingFollow = await this.followsRepository.findOne({
            where: { followerId, followingId }
        });

        if (!existingFollow) {
            throw new NotFoundException('You are not following this user');
        }

        await this.followsRepository.remove(existingFollow);
        return { message: 'User unfollowed successfully' };
    }

    async getUserFollowers(userId: number): Promise<{ followers: any[], count: number }> {
        
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const followers = await this.followsRepository.find({
            where: { followingId: userId },
            relations: ['follower'],
            order: { createdAt: 'DESC' }
        });

        return {
            followers: followers.map(follow => ({
                id: follow.follower.id,
                name: follow.follower.name,
                email: follow.follower.email,
                avatar_url: follow.follower.avatar_url,
                followedAt: follow.createdAt
            })),
            count: followers.length
        };
    }

    async getUserFollowing(userId: number): Promise<{ following: any[], count: number }> {
        
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const following = await this.followsRepository.find({
            where: { followerId: userId },
            relations: ['following'],
            order: { createdAt: 'DESC' }
        });

        return {
            following: following.map(follow => ({
                id: follow.following.id,
                name: follow.following.name,
                email: follow.following.email,
                avatar_url: follow.following.avatar_url,
                followedAt: follow.createdAt
            })),
            count: following.length
        };
    }

    async getFollowerCount(userId: number): Promise<number> {
        return await this.followsRepository.count({ where: { followingId: userId } });
    }

    async getFollowingCount(userId: number): Promise<number> {
        return await this.followsRepository.count({ where: { followerId: userId } });
    }

    async checkIfFollowing(followerId: number, followingId: number): Promise<boolean> {
        const follow = await this.followsRepository.findOne({
            where: { followerId, followingId }
        });
        return !!follow;
    }
}
