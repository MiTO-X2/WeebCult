import { describe, it, expect } from 'vitest';
import sidebarReducer, { openSidebar, closeSidebar } from './sidebarSlice';

describe('sidebarSlice', () => {
    it('starts closed', () => {
        const state = sidebarReducer(undefined, { type: '@@INIT' });
        expect(state.sidebarOpen).toBe(false);
    });

    it('opens the sidebar', () => {
        const state = sidebarReducer(undefined, openSidebar());
        expect(state.sidebarOpen).toBe(true);
    });

    it('closes the sidebar', () => {
        let state = sidebarReducer(undefined, openSidebar());
        state = sidebarReducer(state, closeSidebar());
        expect(state.sidebarOpen).toBe(false);
    });

    it('is idempotent: opening an open sidebar stays open', () => {
        let state = sidebarReducer(undefined, openSidebar());
        state = sidebarReducer(state, openSidebar());
        expect(state.sidebarOpen).toBe(true);
    });

    it('is idempotent: closing a closed sidebar stays closed', () => {
        const state = sidebarReducer(undefined, closeSidebar());
        expect(state.sidebarOpen).toBe(false);
    });
});