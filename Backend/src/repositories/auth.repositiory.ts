import { serverconfig } from "../config/server.config";
import { CreateUserDTO, LoginResponseDTO, UserDTO } from "../dtos/user.dto"
import { User } from "../models/auth.Schema"
import bcrypt, { genSalt } from "bcrypt";

export async function createUser(data: UserDTO): Promise<CreateUserDTO> {
    const existingUser = await User.findOne({
        $or: [
            { email: data.email.toLowerCase().trim() },
            { username: data.username.trim() }
        ]
    });

    if (existingUser) {
        throw new Error("Email or username already exists");
    }

    const salt=await bcrypt.genSalt(serverconfig.SALTROUNDS);

    const hash = await bcrypt.hash(data.password, salt);

    data.password=hash;

    const user=new User(data);
    return await user.save();

}

export async function loginUser(email:string): Promise<LoginResponseDTO | null> {
    return await User.findOne({ email });
}