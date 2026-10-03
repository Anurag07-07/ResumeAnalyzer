import { UserDTO } from "../dto/user.dto";


export async function signupservice(data:UserDTO){
    const response = await createUser(data)
    return response
}

export function signinservice(){

}