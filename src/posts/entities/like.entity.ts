import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { postEntity } from 'src/posts/entities/post.entity';

@Entity('likes')
@Unique(['userId', 'postId']) 
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    postId: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => postEntity, (post) => post.likes)
    post: postEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
