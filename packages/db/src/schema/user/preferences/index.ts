// Active preferences - currently in use
export * from './notificationPreferences';
export * from './notificationSchedules';
export * from './userPreferences';

// Commented preferences - not currently in use but preserved for future
/* 
// Tabla de preferencias de privacidad
export const privacyPreferences = pgTable('privacy_preferences', {
  id: generateIdField({ name: 'privacy_preference_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  dataSharing: boolean('data_sharing').default(false).notNull(), // Compartir datos anónimos para analytics
  marketingEmails: boolean('marketing_emails').default(false).notNull(), // Emails de marketing
  thirdPartySharing: boolean('third_party_sharing').default(false).notNull(), // Compartir con terceros
  profileVisibility: profileVisibilityEnum('profile_visibility').default(ProfileVisibility.PRIVATE).notNull(),
  locationTracking: boolean('location_tracking').default(false).notNull(), // Tracking de ubicación
  analyticsTracking: boolean('analytics_tracking').default(true).notNull(), // Analytics de la app
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

// Tabla de preferencias de accesibilidad
export const accessibilityPreferences = pgTable('accessibility_preferences', {
  id: generateIdField({ name: 'accessibility_preference_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fontSize: fontSizeEnum('font_size').default(FontSize.MEDIUM).notNull(),
  highContrast: boolean('high_contrast').default(false).notNull(),
  reducedMotion: boolean('reduced_motion').default(false).notNull(),
  screenReader: boolean('screen_reader').default(false).notNull(),
  voiceOver: boolean('voice_over').default(false).notNull(),
  colorBlindSupport: boolean('color_blind_support').default(false).notNull(),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});
*/
