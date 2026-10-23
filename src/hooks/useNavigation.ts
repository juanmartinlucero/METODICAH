import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { STORAGE_KEYS } from '../constants/storageKeys';

export function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    if (!firstSegment || firstSegment === 'dashboard') return 'dashboard';
    return firstSegment;
  }, [location.pathname]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NAVIGATION.SIDEBAR_COLLAPSED);
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return true;
    return false;
  });

  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NAVIGATION.RIGHT_SIDEBAR_COLLAPSED);
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined' && window.innerWidth < 1200) return true;
    return false;
  });

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isMobileAnalyticsOpen, setIsMobileAnalyticsOpen] = useState<boolean>(false);

  const selectTab = useCallback((tab: string) => {
    const targetPath = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
    navigate(targetPath);
  }, [navigate]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.NAVIGATION.SIDEBAR_COLLAPSED, String(next));
      return next;
    });
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.NAVIGATION.RIGHT_SIDEBAR_COLLAPSED, String(next));
      return next;
    });
  }, []);

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen(prev => !prev);
    setIsMobileAnalyticsOpen(false);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const toggleMobileAnalytics = useCallback(() => {
    setIsMobileAnalyticsOpen(prev => !prev);
    setIsMobileNavOpen(false);
  }, []);

  const closeMobileAnalytics = useCallback(() => {
    setIsMobileAnalyticsOpen(false);
  }, []);

  // Automatically close mobile drawers upon route navigation
  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsMobileAnalyticsOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts:
  // - Ctrl+B / Cmd+B to toggle left sidebar
  // - Ctrl+Alt+B / Cmd+Alt+B to toggle right analytics sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isKeyB = e.key === 'b' || e.key === 'B';
      if (!isKeyB) return;

      const isModifier = e.ctrlKey || e.metaKey;
      if (!isModifier) return;

      if (e.altKey) {
        // Ctrl+Alt+B: Right analytics sidebar
        e.preventDefault();
        toggleRightSidebar();
      } else {
        // Ctrl+B: Left navigation sidebar
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleRightSidebar]);

  return {
    activeTab,
    selectTab,
    isSidebarCollapsed,
    toggleSidebar,
    isRightSidebarCollapsed,
    toggleRightSidebar,
    isMobileNavOpen,
    setIsMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    isMobileAnalyticsOpen,
    setIsMobileAnalyticsOpen,
    toggleMobileAnalytics,
    closeMobileAnalytics
  };
}
