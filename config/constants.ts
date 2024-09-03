// Application-wide constants

// API endpoints
export const API_BASE_URL = "https://api.yekopointage.com";

// Authentication
export const AUTH_TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// Local storage keys
export const SCHOOL_INFO_KEY = "school_info";
export const CLASS_INFO_KEY = "class_info";
export const STUDENTS_LIST_KEY = "students_list";
export const TEACHERS_LIST_KEY = "teachers_list";
export const SCHEDULE_KEY = "class_schedule";

// Timeouts
export const API_TIMEOUT = 10000; // 10 seconds
export const SYNC_INTERVAL = 300000; // 5 minutes

// UI related
export const ANIMATION_DURATION = 300; // 300 milliseconds
export const MAX_PARTICIPATION_COUNT = 5;

// Date formats
export const DATE_FORMAT = "PPPP";
export const TIME_FORMAT = "HH:mm";

// QR Code
export const QR_CODE_PREFIX = "YEKO_";

// Encryption
export const ENCRYPTION_ALGORITHM = "AES-GCM";
export const ENCRYPTION_KEY_LENGTH = 256;

// Data retention
export const DATA_RETENTION_DAYS = 30;

// Feature flags
export const ENABLE_OFFLINE_MODE = true;
export const ENABLE_BIOMETRIC_AUTH = false;

// Version
export const APP_VERSION = "1.0.0";
