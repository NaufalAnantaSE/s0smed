import { Exclude } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";


@Entity('posts')
export class postEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    content?: string;

    @Column({ nullable: true })
    photo_content?: string;

    @Column()
    authorId: number;

    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    @Exclude({ toPlainOnly: true })
    author: User;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt?: Date;
}