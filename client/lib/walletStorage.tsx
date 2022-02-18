import { LocalStorageKey } from "./constants";

export function getWallet<T>() {
    if (typeof localStorage !== "undefined") {
        if (localStorage.getItem(LocalStorageKey)) {
            return JSON.parse(localStorage.getItem(LocalStorageKey) || '') as T;
        } else {
            return null;
        }
    }
    return null;
}

export function saveWallet(data: any) {
    if (typeof localStorage !== "undefined") {
        return localStorage.setItem(LocalStorageKey, JSON.stringify(data));
    }
}