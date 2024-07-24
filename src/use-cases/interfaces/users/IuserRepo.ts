import User from '../../../entities/user'



interface UserRepo{
    findbyEmail(email:string):Promise<User|null>

}



export default UserRepo