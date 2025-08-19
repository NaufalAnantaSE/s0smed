import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('follows')
@Unique(['followerId', 'followingId']) // Prevent duplicate follows
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number; // User yang melakukan follow

    @Column()
    followingId: number; // User yang di-follow

    @ManyToOne(() => User, (user) => user.followers, { eager: true })
    follower: User; // User yang melakukan follow

    @ManyToOne(() => User, (user) => user.following)
    following: User; // User yang di-follow

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
