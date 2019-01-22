import bcrypt from 'bcryptjs';

export const Hash:Function =async (password:string) => {
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
};

export const Compare=async (password:string,Hash:string) => {
    // console.log(Hash);
    
      return await bcrypt.compare(password, Hash);
      
}
