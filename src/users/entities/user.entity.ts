import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { postEntity } from "src/posts/entities/post.entity";
import { Exclude } from "class-transformer";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column({ select: false })
    @Exclude()
    password: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatar_url?: string;

    @OneToMany(() => postEntity, (post) => post.author)
    posts: postEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}