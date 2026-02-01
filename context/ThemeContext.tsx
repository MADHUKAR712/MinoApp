/**
 * ThemeContext - Dark/Light theme state management
 * Persists user preference and syncs with system theme
 */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { getItem, setItem, StorageKeys } from '../utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => Promise<void>;
    toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('system');

    // Calculate effective dark mode based on theme preference
    const isDark = useMemo(() => {
        if (theme === 'system') {
            return systemColorScheme === 'dark';
        }
        return theme === 'dark';
    }, [theme, systemColorScheme]);

    // Load persisted theme preference on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await getItem<ThemeMode>(StorageKeys.THEME);
                if (storedTheme) {
                    setThemeState(storedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };
        loadTheme();
    }, []);

    const setTheme = useCallback(async (newTheme: ThemeMode): Promise<void> => {
        try {
            await setItem(StorageKeys.THEME, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }, []);

    const toggleTheme = useCallback(async (): Promise<void> => {
        const newTheme = isDark ? 'light' : 'dark';
        await setTheme(newTheme);
    }, [isDark, setTheme]);

    const value = useMemo<ThemeContextType>(() => ({
        theme,
        isDark,
        setTheme,
        toggleTheme,
    }), [theme, isDark, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
