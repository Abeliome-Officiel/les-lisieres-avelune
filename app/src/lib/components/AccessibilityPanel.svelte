<script lang="ts">
  import { onMount } from 'svelte';
  import {
    accessibilityProfiles,
    defaultAccessibilityProfile,
    type AccessibilityProfile,
    type AccessibilitySettings
  } from '$lib/accessibility/profiles';

  const storageKey = 'avelune-accessibility-v1';

  const fontLabels: Record<AccessibilitySettings['fontFamily'], string> = {
    system: 'Police système',
    readable: 'Police sans empattement',
    serif: 'Police avec empattements',
    monospace: 'Police à chasse fixe'
  };

  let panelOpen = false;
  let profileId: AccessibilityProfile['id'] = defaultAccessibilityProfile;
  let settings: AccessibilitySettings = structuredClone(
    accessibilityProfiles[0].settings
  );

  function fontStack(font: AccessibilitySettings['fontFamily']): string {
    switch (font) {
      case 'readable':
        return 'Verdana, Arial, sans-serif';
      case 'serif':
        return 'Georgia, "Times New Roman", serif';
      case 'monospace':
        return '"Courier New", Courier, monospace';
      default:
        return 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    }
  }

  function applySettings(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    root.dataset.accessibilityProfile = profileId;
    root.dataset.colorScheme = settings.colorScheme;
    root.dataset.interfaceDensity = settings.density;
    root.dataset.removeItalics = String(settings.removeItalics);
    root.dataset.reducedMotion = String(settings.reducedMotion);
    root.dataset.highContrast = String(settings.highContrast);
    root.dataset.emphasizeActiveTask = String(settings.emphasizeActiveTask);

    root.style.setProperty('--a11y-font-family', fontStack(settings.fontFamily));
    root.style.setProperty('--a11y-font-scale', String(settings.fontScale));
    root.style.setProperty('--a11y-line-height', String(settings.lineHeight));
    root.style.setProperty(
      '--a11y-letter-spacing',
      `${settings.letterSpacingEm}em`
    );
    root.style.setProperty(
      '--a11y-word-spacing',
      `${settings.wordSpacingEm}em`
    );
    root.style.setProperty(
      '--a11y-max-line',
      `${settings.maxLineLengthCh}ch`
    );

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ profileId, settings })
      );
    } catch {
      // Le réglage reste actif pour la session courante.
    }
  }

  function applyProfile(id: AccessibilityProfile['id']): void {
    const profile =
      accessibilityProfiles.find((item) => item.id === id) ??
      accessibilityProfiles[0];

    profileId = profile.id;
    settings = structuredClone(profile.settings);
    applySettings();
  }

  function patchSettings(patch: Partial<AccessibilitySettings>): void {
    settings = { ...settings, ...patch };
    applySettings();
  }

  onMount(() => {
    try {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored) as {
          profileId?: AccessibilityProfile['id'];
          settings?: AccessibilitySettings;
        };

        if (
          parsed.profileId &&
          accessibilityProfiles.some(
            (profile) => profile.id === parsed.profileId
          ) &&
          parsed.settings
        ) {
          profileId = parsed.profileId;
          settings = parsed.settings;
          applySettings();
          return;
        }
      }
    } catch {
      // Repli sur le profil sombre.
    }

    applyProfile(defaultAccessibilityProfile);
  });
</script>

<div class="accessibility-control">
  <button
    class="accessibility-trigger"
    type="button"
    aria-expanded={panelOpen}
    aria-controls="accessibility-panel"
    onclick={() => (panelOpen = !panelOpen)}
  >
    Affichage
  </button>

  {#if panelOpen}
    <section
      id="accessibility-panel"
      class="accessibility-panel"
      aria-label="Réglages d’affichage et d’accessibilité"
    >
      <header>
        <div>
          <strong>Affichage</strong>
          <small>Les réglages sont conservés dans ce navigateur.</small>
        </div>

        <button
          class="close-button"
          type="button"
          aria-label="Fermer les réglages"
          onclick={() => (panelOpen = false)}
        >
          ×
        </button>
      </header>

      <label>
        <span>Profil de départ</span>
        <select
          value={profileId}
          onchange={(event) =>
            applyProfile(
              (event.currentTarget as HTMLSelectElement)
                .value as AccessibilityProfile['id']
            )}
        >
          {#each accessibilityProfiles as profile}
            <option value={profile.id}>{profile.name}</option>
          {/each}
        </select>
      </label>

      <p class="profile-description">
        {accessibilityProfiles.find((profile) => profile.id === profileId)
          ?.description}
      </p>

      <label>
        <span>Famille de police</span>
        <select
          value={settings.fontFamily}
          onchange={(event) =>
            patchSettings({
              fontFamily: (event.currentTarget as HTMLSelectElement)
                .value as AccessibilitySettings['fontFamily']
            })}
        >
          {#each Object.entries(fontLabels) as [value, label]}
            <option value={value}>{label}</option>
          {/each}
        </select>
      </label>

      <label>
        <span>Taille du texte : {Math.round(settings.fontScale * 100)} %</span>
        <input
          type="range"
          min="0.9"
          max="1.35"
          step="0.05"
          value={settings.fontScale}
          oninput={(event) =>
            patchSettings({
              fontScale: Number(
                (event.currentTarget as HTMLInputElement).value
              )
            })}
        />
      </label>

      <label>
        <span>Hauteur de ligne : {settings.lineHeight.toFixed(2)}</span>
        <input
          type="range"
          min="1.35"
          max="2"
          step="0.05"
          value={settings.lineHeight}
          oninput={(event) =>
            patchSettings({
              lineHeight: Number(
                (event.currentTarget as HTMLInputElement).value
              )
            })}
        />
      </label>

      <label>
        <span>
          Espacement des lettres :
          {settings.letterSpacingEm.toFixed(3)} em
        </span>
        <input
          type="range"
          min="0"
          max="0.08"
          step="0.005"
          value={settings.letterSpacingEm}
          oninput={(event) =>
            patchSettings({
              letterSpacingEm: Number(
                (event.currentTarget as HTMLInputElement).value
              )
            })}
        />
      </label>

      <label>
        <span>
          Espacement des mots :
          {settings.wordSpacingEm.toFixed(2)} em
        </span>
        <input
          type="range"
          min="0"
          max="0.2"
          step="0.01"
          value={settings.wordSpacingEm}
          oninput={(event) =>
            patchSettings({
              wordSpacingEm: Number(
                (event.currentTarget as HTMLInputElement).value
              )
            })}
        />
      </label>

      <label>
        <span>Longueur de ligne : {settings.maxLineLengthCh} caractères</span>
        <input
          type="range"
          min="48"
          max="92"
          step="2"
          value={settings.maxLineLengthCh}
          oninput={(event) =>
            patchSettings({
              maxLineLengthCh: Number(
                (event.currentTarget as HTMLInputElement).value
              )
            })}
        />
      </label>

      <div class="check-grid">
        <label class="check">
          <input
            type="checkbox"
            checked={settings.removeItalics}
            onchange={(event) =>
              patchSettings({
                removeItalics: (event.currentTarget as HTMLInputElement)
                  .checked
              })}
          />
          <span>Éviter l’italique</span>
        </label>

        <label class="check">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onchange={(event) =>
              patchSettings({
                reducedMotion: (event.currentTarget as HTMLInputElement)
                  .checked
              })}
          />
          <span>Réduire les mouvements</span>
        </label>

        <label class="check">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onchange={(event) =>
              patchSettings({
                highContrast: (event.currentTarget as HTMLInputElement)
                  .checked
              })}
          />
          <span>Contraste renforcé</span>
        </label>

        <label class="check">
          <input
            type="checkbox"
            checked={settings.emphasizeActiveTask}
            onchange={(event) =>
              patchSettings({
                emphasizeActiveTask: (
                  event.currentTarget as HTMLInputElement
                ).checked
              })}
          />
          <span>Mettre l’action active en évidence</span>
        </label>
      </div>
    </section>
  {/if}
</div>

<style>
  .accessibility-control {
    position: fixed;
    z-index: 80;
    right: 1rem;
    bottom: 1rem;
    font-family: var(--a11y-font-family, system-ui, sans-serif);
  }

  .accessibility-trigger,
  .close-button {
    border: 1px solid rgba(219, 191, 237, 0.3);
    background: #2b1e35;
    color: #f3edf7;
    cursor: pointer;
  }

  .accessibility-trigger {
    min-height: 2.75rem;
    padding: 0.65rem 1rem;
    border-radius: 999px;
    box-shadow: 0 0.65rem 2rem rgba(0, 0, 0, 0.35);
    font-weight: 700;
  }

  .accessibility-panel {
    position: absolute;
    right: 0;
    bottom: 3.5rem;
    width: min(25rem, calc(100vw - 2rem));
    max-height: min(42rem, calc(100vh - 6rem));
    overflow: auto;
    padding: 1rem;
    border: 1px solid rgba(219, 191, 237, 0.25);
    border-radius: 0.8rem;
    background: #1d1624;
    color: #f3edf7;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.48);
  }

  .accessibility-panel header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .accessibility-panel header div,
  .accessibility-panel label {
    display: grid;
    gap: 0.35rem;
  }

  .accessibility-panel small,
  .profile-description {
    color: #b8abbf;
  }

  .close-button {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    font-size: 1.4rem;
  }

  .accessibility-panel select,
  .accessibility-panel input[type='range'] {
    width: 100%;
  }

  .accessibility-panel select {
    min-height: 2.5rem;
    padding: 0.45rem;
    border: 1px solid rgba(219, 191, 237, 0.22);
    border-radius: 0.4rem;
    background: #120e17;
    color: #f3edf7;
  }

  .accessibility-panel > label {
    margin-top: 0.9rem;
  }

  .profile-description {
    margin: 0.65rem 0 0;
    font-size: 0.9rem;
  }

  .check-grid {
    display: grid;
    gap: 0.6rem;
    margin-top: 1rem;
  }

  .check {
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  :global(html[data-color-scheme='light']) .accessibility-panel,
  :global(html[data-color-scheme='light']) .accessibility-trigger {
    border-color: rgba(70, 52, 82, 0.25);
    background: #f7f2e9;
    color: #28212d;
  }

  :global(html[data-color-scheme='light']) .accessibility-panel select {
    border-color: rgba(70, 52, 82, 0.25);
    background: #ffffff;
    color: #28212d;
  }

  :global(html[data-color-scheme='light']) .accessibility-panel small,
  :global(html[data-color-scheme='light']) .profile-description {
    color: #665a6c;
  }

  :global(html[data-color-scheme='light']) .close-button {
    background: #e7dce9;
    color: #28212d;
  }
</style>
