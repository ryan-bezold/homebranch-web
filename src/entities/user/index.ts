// Model
export type {UserModel} from './model/UserModel';

// API
export type {AssignRoleRequest} from './api/dtos';
export {
    useGetUsersInfiniteQuery,
    useGetUserByIdQuery,
    useRestrictUserMutation,
    useUnrestrictUserMutation,
    useAssignRoleMutation
} from './api/api'