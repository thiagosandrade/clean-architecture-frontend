import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    getItem<T = string>(key: string): T | null {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return null;
        }

        try {

            return JSON.parse(value) as T;

        } catch {

            return value as T;

        }

    }


    setItem<T>(key: string, value: T): void {

        if (typeof value === 'string') {

            localStorage.setItem(
                key,
                value
            );

            return;

        }


        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }


    removeItem(key: string): void {

        localStorage.removeItem(key);

    }


    clear(): void {

        localStorage.clear();

    }


    has(key: string): boolean {

        return localStorage.getItem(key) !== null;

    }

}