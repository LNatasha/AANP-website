/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Triggers native TTS reading of text in European Portuguese (pt-PT).
 * Cancels any active utterance beforehand.
 */
export function speakText(text: string, ttsEnabled: boolean) {
  if (!ttsEnabled || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop active speaking

    // Clean text from emojis or markdown characters for clearer voice reading
    const cleanText = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
      .replace(/[#*_\-\n]+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-PT'; // European Portuguese
    utterance.rate = 0.9; // Slightly slower for senior beekeepers to follow easily

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Error executing SpeechSynthesis:', error);
  }
}

/**
 * Stop any active text-to-speech speaking
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
