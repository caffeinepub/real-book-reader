import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Book {
    title: string;
    author: string;
    totalPages: bigint;
}
export interface backendInterface {
    getBook(title: string): Promise<Book>;
    initializeBook(title: string, author: string, totalPages: bigint): Promise<void>;
    updateTitle(oldTitle: string, newTitle: string): Promise<void>;
}
