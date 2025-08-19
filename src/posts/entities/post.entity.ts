import { Exclude } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}