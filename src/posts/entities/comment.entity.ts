import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { postEntity } from 'src/posts/entities/post.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column()
    userId: number;

    @Column()
    postId: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => postEntity, (post) => post.comments)
    post: postEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt?: Date;
}
