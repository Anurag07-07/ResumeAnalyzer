import { UserDTO } from "../dto/user.dto";
import { createUser } from "../repo/auth.repositiory";

export async function signupservice(data:UserDTO){
    const response = await createUser(data)
    return response
}

export function signinservice(){

}