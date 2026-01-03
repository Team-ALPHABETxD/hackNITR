import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type ActionType = 'navigate' | 'fill_form' | 'click' | 'speak';

export interface VoiceActionPayload {
  action: ActionType;
  data: {
    path?: string;
    fields?: Record<string, any>;
    elementId?: string;
  };
  response_text: string;
}

export const executeAction = (
  actionPayload: VoiceActionPayload,
  router: AppRouterInstance,
  speak: (text: string) => void
) => {
  const { action, data, response_text } = actionPayload;

  // 1. Speak the response
  if (response_text) {
    speak(response_text);
  }

  // 2. Perform action
  switch (action) {
    case 'navigate':
      if (data.path) {
        router.push(data.path);
      }
      break;
    
    case 'click':
        if (data.elementId) {
            const el = document.getElementById(data.elementId);
            if (el) {
                el.click();
            } else {
                console.warn(`Element with id ${data.elementId} not found`);
            }
        }
        break;

    case 'fill_form':
      if (data.fields) {
        Object.entries(data.fields).forEach(([key, value]) => {
          // Try to find input by name, id, or placeholder
          const inputs = document.querySelectorAll('input, select, textarea');
          let found = false;
          
          inputs.forEach((input) => {
            if (found) return; // Simple heuristic: stop after first match per field
            const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            const nameMatch = el.name?.toLowerCase().includes(key.toLowerCase());
            const idMatch = el.id?.toLowerCase().includes(key.toLowerCase());
            
            if (nameMatch || idMatch) {
                el.value = String(value);
                // Trigger change event for React controlled components
                const event = new Event('input', { bubbles: true });
                el.dispatchEvent(event);
                const changeEvent = new Event('change', { bubbles: true });
                el.dispatchEvent(changeEvent);
                found = true;
            }
          });
        });
      }
      break;
  }
};
