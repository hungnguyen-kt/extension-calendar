// background.js

async function updateBadgeDate() {
  const today = new Date();
  const dateStr = String(today.getDate());
  
  // Update badge text with the current date
  await chrome.action.setBadgeText({ text: dateStr });
  
  // Set badge background color (matching our accent color or a nice complementary color)
  await chrome.action.setBadgeBackgroundColor({ color: '#ff3b30' });
}

// Update on install
chrome.runtime.onInstalled.addListener(async () => {
  await updateBadgeDate();
  
  // Set up an alarm to trigger daily
  // To make it simple, we'll just trigger it every few hours to ensure it updates reasonably soon after midnight.
  chrome.alarms.create('updateBadge', { periodInMinutes: 60 });
});

// Update on startup
chrome.runtime.onStartup.addListener(async () => {
  await updateBadgeDate();
});

// Update on alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'updateBadge') {
    await updateBadgeDate();
  }
});
