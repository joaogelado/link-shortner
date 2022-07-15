export interface Session {
    id?: string;
    session?: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        password?: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SessionReadData {
    where: SessionCommonWhere;
    select?: SessionCommonSelect;
}

export interface SessionReadFirstData {
    where: SessionCommonWhere;
    select?: SessionCommonSelect;
}

export interface SessionCreateData {
    data: SessionCommonData;
}

export interface SessionUpdateData {
    where: SessionCommonWhere;
    data: SessionCommonData;
}

export interface SessionDeleteData {
    where: SessionCommonWhere;
}

export type SessionCommonSelect = {
    id?: boolean;
    session?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?:
        | boolean
        | {
              select?: {
                  id?: boolean;
                  email?: boolean;
                  name?: boolean;
                  createdAt?: boolean;
                  updatedAt?: boolean;
              };
          };
};

export interface SessionCommonWhere {
    id?: string;
    session?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface SessionCommonData {
    session: string;
    user: {
        connect?: {
            id?: string;
            name?: string;
            email?: string;
        };
    };
}

export interface SessionRepository {
    read: (data: SessionReadData) => Promise<Session | null>;
    readFirst: (data: SessionReadFirstData) => Promise<Session | null>;
    create: (data: SessionCreateData) => Promise<void>;
    update: (data: SessionUpdateData) => Promise<void>;
    delete: (data: SessionDeleteData) => Promise<void>;
}
