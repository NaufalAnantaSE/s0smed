import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatar_url?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;
    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}