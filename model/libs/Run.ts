
import {exec} from 'child_process'

const util = require('util');
const exe = util.promisify(exec);

export default async function Run(command:string) {
    const {stdout,stderr}=await exe(command);   
    return {stderr,stdout};
}