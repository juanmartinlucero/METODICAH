/**
 * Catálogo centralizado y tipado de claves de preferencias de UI en LocalStorage.
 * Las entidades de dominio se persisten exclusivamente en Cloud Firestore con caché offline nativo.
 */
export const STORAGE_KEYS = {
  // Prefijos de vistas para persistencia de preferencias de listado (orden, agrupación y modo de vista)
  EVENTS: 'metodicah_events',
  CLIENTS: 'metodicah_clients',
  SUPPLIERS: 'metodicah_suppliers',
  CREW: 'metodicah_crew_members',

  // Preferencias locales de interfaz y configuración visual
  SETTINGS: {
    STAGES: 'metodicah_event_stages',
    DATE_FORMAT: 'metodicah_date_format',
    SUBTAB: 'metodicah_settings_subtab',
  },

  // Estado de diseño y barras laterales
  NAVIGATION: {
    ACTIVE_TAB: 'metodicah_active_tab',
    SIDEBAR_COLLAPSED: 'metodicah_sidebar_collapsed',
    RIGHT_SIDEBAR_COLLAPSED: 'metodicah_right_sidebar_collapsed',
  },

  // Preferencias de visualización de Eventos
  VIEW_PREFERENCES: {
    EVENTS_SORT_BY: 'metodicah_events_sort_by',
    EVENTS_VIEW_MODE: 'metodicah_events_view_mode',
    EVENTS_GROUP_MODE: 'metodicah_events_group_mode',
    EVENTS_GROUP_BY_MONTH: 'metodicah_events_group_by_month',
  }
} as const;

export type StorageKeysType = typeof STORAGE_KEYS;
