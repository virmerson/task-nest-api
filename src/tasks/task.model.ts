import {
    Entity, ObjectIdColumn, ObjectId, Column
} from "typeorm";

@Entity()
export class Task {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    id: number

    @Column()
    title: string;

    @Column()
    completed: boolean;
}