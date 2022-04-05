import { User } from '#/Watchdog/Domain/Model/User';
import * as Api from '@/core/api-frontend';


export class UserService
    extends Api.EntityService<User>
{
    
    public static readonly ENTITY = User;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
    
    public async getMe () : Promise<User>
    {
        return this.getItem(null, '#PATH#/me');
    }
    
}
