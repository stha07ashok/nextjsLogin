import { Table, Column, Model, DataType } from "sequelize-typescript";
import { user } from "../types/userTypes";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model<user> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  lastLogin!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column(DataType.STRING)
  resetPasswordToken?: string;

  @Column(DataType.DATE)
  resetPasswordExpiresAt?: Date;

  @Column(DataType.STRING)
  verificationToken?: string;

  @Column(DataType.DATE)
  verificationTokenExpiresAt?: Date;
}
