import {
    Entity, ObjectIdColumn, ObjectId, Column
} from "typeorm";

@Entity()
export class Task {
    @ObjectIdColumn()
    _id: ObjectId;


    @Column()
    title: string;

    @Column()
    completed: boolean;
}