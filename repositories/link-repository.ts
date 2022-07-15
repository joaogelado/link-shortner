export interface Link {
    id: string;
    name: string;
    clicks: number;
    createdAt: Date;
}

export interface LinkSelect {
    id: boolean;
    name: boolean;
    clicks: boolean;
    createdAt: boolean;
}

export interface LinkOrderBy {
    id: "asc" | "desc";
    name: "asc" | "desc";
    clicks: "asc" | "desc";
    createdAt: "asc" | "desc";
}

export interface ReadAllLinkData {
    where?: {
        id?: string;
        name?: string;
        clicks?: number;
    };
    select?: LinkSelect;
    orderBy?: LinkOrderBy;
}

export interface ReadLinkData {
    where: {
        id?: string;
        name?: string;
    };
    select?: LinkSelect;
}

export interface CreateLinkData {
    name: string;
}

export interface UpdateLinkData {
    where: {
        id?: string;
        name?: string;
    };
    data: {
        name?: string;
        clicks?: number;
    };
}

export interface DeleteLinkData {
    where: {
        id?: string;
        name?: string;
    };
}

export interface LinkRepository {
    readAll: (data: ReadAllLinkData) => Promise<Link[]>;
    read: (data: ReadLinkData) => Promise<Link>;
    create: (data: CreateLinkData) => Promise<void>;
    update: (data: UpdateLinkData) => Promise<void>;
    delete: (data: DeleteLinkData) => Promise<void>;
}
