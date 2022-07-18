export interface User {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    session?: {
        id?: string;
        session?: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
}

export interface UserReadAllData {
    where?: UserCommonWhere;
    select?: UserCommonSelect;
    orderBy?: UserCommonOrderBy;
}

export interface UserReadData {
    where: UserCommonWhere;
    select?: UserCommonSelect;
}

export interface UserCreateData {
    data: UserCommonData;
}

export interface UserUpdateData {
    where: UserCommonWhere;
    data: UserCommonData;
}

export interface UserDeleteData {
    where: UserCommonWhere;
}

export interface UserCommonOrderBy {
    id?: "asc" | "desc";
    name?: "asc" | "desc";
    email?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    updatedAt?: "asc" | "desc";
}

export type UserCommonSelect = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    session?:
        | boolean
        | {
              where?: {
                  id?: {
                      equals?: string;
                  };
                  session?: {
                      equals?: string;
                  };
              };
          };
};

export interface UserCommonWhere {
    id?: string;
    name?: string;
    email?: string;
}

export interface UserCommonData {
    name?: string;
    email?: string;
    password?: string;
}

export interface UserRepository {
    readAll: (data: UserReadAllData) => Promise<User[] | null>;
    read: (data: UserReadData) => Promise<User | null>;
    create: (data: UserCreateData) => Promise<void>;
    update: (data: UserUpdateData) => Promise<void>;
    delete: (data: UserDeleteData) => Promise<void>;
}
