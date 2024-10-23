import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Block {
    @PrimaryColumn()
    blockNum: number;

    @PrimaryColumn()
    hash: string;

    @Column({ type: 'json' })
    block: string;

    @Column({ type: 'json' })
    transactionReceipt: string;

    @Column({ type: 'json' })
    log: string[];
}