import { axiosClient } from "@/api/axiosClient";

export interface Category {
    _id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    icon?: string;
}

export const categoryApi = {
    getAll(): Promise<Category[]> {
        return axiosClient.get("/categories").then(res => res.data);
    },

    create(payload: {
        name: string;
        type: "INCOME" | "EXPENSE";
        icon?: string;
    }): Promise<Category> {
        return axiosClient.post("/categories", payload).then(res => res.data);
    }
};
